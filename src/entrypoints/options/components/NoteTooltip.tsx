interface NoteModal {
  children: string,
}

export default function NoteModal({ children }: NoteModal) {
  return (
    <div
      className={"bg-surface border z-10 border-border text-left rounded-xl p-3 w-3xs absolute top-8 -translate-x-11/12 " + (children ? "text-text-primary" : "text-text-muted")}
      onClick={(e) => e.stopPropagation()}
    >
      <p className="wrap-break-word whitespace-pre-line">{children ? children : "No notes..."}</p>
    </div>
  );
}
