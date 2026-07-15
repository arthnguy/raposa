import JSZip from "jszip";
import initSqlJs, { type Database } from "sql.js";
import sqlWasmUrl from "sql.js/dist/sql-wasm.wasm?url";

export interface ParsedAnkiCard {
  front: string;
  back: string;
}

// Expensive, do once and reuse
let sqlJsPromise: ReturnType<typeof initSqlJs> | null = null;

function getSqlJs() {
  if (!sqlJsPromise) {
    sqlJsPromise = initSqlJs({ locateFile: () => sqlWasmUrl });
  }
  return sqlJsPromise;
}

// Strips HTML to plain text with the browser's own parser to handle markup and HTML entities properly
function stripAnkiHtml(raw: string): string {
  // Replace elements with space before parsing, deleting as-is would leave no separator
  const withLineBreaks = raw
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/(div|p)>/gi, " ");

  const el = document.createElement("div");
  el.innerHTML = withLineBreaks;

  // Remove images entirely — this is a text-only extension 
  // Setting .innerHTML with an <img> present can trigger a real fetch attempt for its src even though this element is never added to the page
  el.querySelectorAll("img").forEach((img) => img.remove());

  return (el.textContent ?? "")
    .replace(/\[sound:[^\]]*\]/g, "") // Anki's own audio reference syntax, not HTML
    .replace(/\s+/g, " ")
    .trim();
}

export async function parseApkgFile(buffer: ArrayBuffer): Promise<ParsedAnkiCard[]> {
  const zip = await JSZip.loadAsync(buffer);

  const dbFile = zip.file("collection.anki2");
  if (!dbFile) {
    throw new Error("This .apkg file doesn't contain a valid Anki collection.");
  }

  const dbBytes = await dbFile.async("uint8array");

  const SQL = await getSqlJs();
  let db: Database | null = null;

  try {
    db = new SQL.Database(dbBytes);

    // Anki stores every note's fields concatenated into one string, separated by \x1f (the ASCII "unit separator")
    // Types with more fields (e.g. Cloze) won't map onto front/back cleanly.
    const result = db.exec("SELECT flds FROM notes");
    if (result.length === 0) {
      return [];
    }

    const cards: ParsedAnkiCard[] = [];

    for (const row of result[0].values) {
      const flds = row[0] as string;
      const [front, back] = flds.split("\x1f");
      const cleanFront = front ? stripAnkiHtml(front) : "";
      const cleanBack = back ? stripAnkiHtml(back) : "";
      
      if (cleanFront && cleanBack) {
        cards.push({ front: cleanFront, back: cleanBack });
      }
    }

    return cards;
  } finally {
    // Releases the wasm-side memory backing this database, no automatic garbage collection
    db?.close();
  }
}