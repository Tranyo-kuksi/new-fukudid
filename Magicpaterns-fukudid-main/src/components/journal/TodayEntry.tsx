import React, { useState, useRef } from "react";
import { SmileIcon, CloudIcon, SunIcon, MoonIcon, StarIcon, ImageIcon, MusicIcon, MapPinIcon, ChevronLeftIcon, ChevronRightIcon, PenIcon } from "lucide-react";
const prompts = ["If you could have any superpower for a day, what would it be and how would you use it?", "What's the most interesting conversation you had today?", "What's something that made you smile today?", "If you could travel anywhere right now, where would you go and why?", "What's a small goal you'd like to accomplish this week?", "Write a letter to your future self - what would you say?"];
export const TodayEntry = () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
  });
  const [mood, setMood] = useState<string | null>(null);
  const [promptIndex, setPromptIndex] = useState(0);
  const [entryContent, setEntryContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const nextPrompt = () => {
    setPromptIndex(current => (current + 1) % prompts.length);
  };
  const previousPrompt = () => {
    setPromptIndex(current => (current - 1 + prompts.length) % prompts.length);
  };
  const insertPrompt = () => {
    const promptText = prompts[promptIndex];
    const promptWithButtons = `\n✨ ${promptText}\n\n`;
    const newContent = entryContent ? `${entryContent}\n${promptWithButtons}` : promptWithButtons;
    setEntryContent(newContent);
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  };
  const moods = [{
    icon: <SmileIcon size={24} />,
    label: "Happy",
    color: "bg-amber-100 text-amber-600 border-amber-200"
  }, {
    icon: <CloudIcon size={24} />,
    label: "Meh",
    color: "bg-slate-100 text-slate-600 border-slate-200"
  }, {
    icon: <SunIcon size={24} />,
    label: "Energetic",
    color: "bg-teal-100 text-teal-600 border-teal-200"
  }, {
    icon: <MoonIcon size={24} />,
    label: "Tired",
    color: "bg-violet-100 text-violet-600 border-violet-200"
  }, {
    icon: <StarIcon size={24} />,
    label: "Inspired",
    color: "bg-purple-100 text-purple-600 border-purple-200"
  }];
  return <div className="max-w-3xl mx-auto px-2 sm:px-0">
      <div className="mb-3 md:mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-blue-800 dark:text-blue-300">
          {formattedDate}
        </h2>
        <p className="text-blue-600 dark:text-blue-400">
          How are you feeling today?
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl p-3 md:p-4 shadow-sm border border-blue-100 dark:border-gray-700">
        <div className="flex flex-wrap gap-2 mb-3">
          {moods.map(item => <button key={item.label} onClick={() => setMood(item.label)} className={`flex items-center px-3 py-1.5 rounded-full border transition-colors flex-1 md:flex-none justify-center ${mood === item.label ? item.color : "bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"}`}>
              <span className="mr-1.5">{item.icon}</span>
              {item.label}
            </button>)}
        </div>
        <div className="relative">
          <textarea ref={textareaRef} value={entryContent} onChange={e => setEntryContent(e.target.value)} className="w-full border border-blue-100 dark:border-gray-700 rounded-xl p-4 min-h-[300px] md:min-h-[400px] focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-500 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 transition-colors text-base" placeholder="Write about your day... what happened? how did it make you feel?"></textarea>
          <div className="absolute right-3 top-3">
            <button onClick={insertPrompt} className="flex items-center gap-2 py-1.5 px-3 bg-blue-50 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400 rounded-lg border border-blue-100 dark:border-gray-700 transition-colors" title={prompts[promptIndex]}>
              <PenIcon size={16} />
              <span className="text-sm font-medium hidden md:inline">
                Get Prompt
              </span>
            </button>
          </div>
          <div className="absolute right-3 bottom-3 flex items-center gap-2">
            <div className="flex items-center bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-700 rounded-lg shadow-sm">
              <button onClick={previousPrompt} className="p-1.5 hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-l-lg border-r border-blue-100 dark:border-gray-700" title="Previous prompt">
                <ChevronLeftIcon size={16} />
              </button>
              <button onClick={nextPrompt} className="p-1.5 hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-r-lg" title="Next prompt">
                <ChevronRightIcon size={16} />
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-3 items-center">
          <div className="flex space-x-1">
            <button className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
              <ImageIcon size={20} />
            </button>
            <button className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
              <MusicIcon size={20} />
            </button>
            <button className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
              <MapPinIcon size={20} />
            </button>
          </div>
          <button className="bg-gradient-to-r from-blue-500 to-amber-600 hover:from-blue-600 hover:to-amber-700 text-white px-4 md:px-6 py-2 rounded-lg font-medium text-sm md:text-base">
            Save Entry
          </button>
        </div>
      </div>
    </div>;
};