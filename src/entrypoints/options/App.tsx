import TimeSettings from "@/entrypoints/options/components/TimeSettings";
import DeckSettings from "@/entrypoints/options/components/DeckSettings";

export default function App() {
  return (
    <div className="min-h-screen bg-background text-text-primary font-sans">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <TimeSettings />
        <hr className="border-t border-border my-7" />
        <DeckSettings />
      </div>
    </div>
  );
}
