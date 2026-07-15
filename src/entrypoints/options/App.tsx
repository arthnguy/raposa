import TimeSettings from "./components/TimeSettings";
import DeckManagement from "./components/DeckManagement";

export default function App() {
  return (
    <div className="min-h-screen bg-background text-text-primary font-sans">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <TimeSettings />
        <hr className="border-t border-border my-7" />
        <DeckManagement />
      </div>
    </div>
  );
}
