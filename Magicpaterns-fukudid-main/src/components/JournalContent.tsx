import React from "react";
import { JournalPage } from "./journal/JournalPage";
import { JournalEntries } from "./journal/JournalEntries";
import { MoodTracker } from "./journal/MoodTracker";
import { Settings } from "./journal/Settings";

interface JournalContentProps {
  activeSection: string;
}

export const JournalContent = ({
  activeSection
}: JournalContentProps) => {
  return (
    <main className="flex-1 overflow-y-auto bg-pink-50 dark:bg-gray-900 transition-colors duration-200">
      {activeSection === "today" && <JournalPage />}
      {activeSection === "entries" && <JournalEntries />}
      {activeSection === "moods" && <MoodTracker />}
      {activeSection === "settings" && <Settings />}
    </main>
  );
};