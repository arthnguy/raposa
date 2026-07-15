export default function DeckSelector() {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-sm font-sans text-text-secondary">
        Current deck:
      </span>
      <select name="deck" className="font-sans text-accent">
        <option>None</option>
      </select>
    </div>
  );
}
