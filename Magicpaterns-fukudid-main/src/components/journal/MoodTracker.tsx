import React, { useState } from 'react';
import { useJournal } from '../../context/JournalContext';
import { 
  FaSkull, 
  FaSadTear, 
  FaMeh, 
  FaSmile, 
  FaGrinStars,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';

const moodIcons = [
  { icon: <FaGrinStars className="w-6 h-6" />, color: 'text-black', bgColor: 'bg-yellow-400', label: 'Fckin Awesome' },
  { icon: <FaSmile className="w-6 h-6" />, color: 'text-black', bgColor: 'bg-green-400', label: 'Pretty GOOD' },
  { icon: <FaMeh className="w-6 h-6" />, color: 'text-black', bgColor: 'bg-blue-400', label: 'MEH' },
  { icon: <FaSadTear className="w-6 h-6" />, color: 'text-black', bgColor: 'bg-orange-400', label: 'Shity' },
  { icon: <FaSkull className="w-6 h-6" />, color: 'text-black', bgColor: 'bg-red-400', label: 'Dead Inside' }
];

export function MoodTracker() {
  const { moodData } = useJournal();
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getMoodSummary = () => {
    const moodCounts = [0, 0, 0, 0, 0];
    Object.values(moodData).forEach(mood => {
      moodCounts[mood]++;
    });
    const maxMood = moodCounts.indexOf(Math.max(...moodCounts));
    return moodIcons[maxMood].label;
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-16 rounded-xl" />);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day);
      const mood = moodData[date];

      days.push(
        <div
          key={day}
          className={`h-16 rounded-xl p-2 relative ${
            mood !== undefined 
              ? `${moodIcons[mood].bgColor} shadow-sm` 
              : 'bg-gray-100 dark:bg-gray-700'
          }`}
        >
          <span className="text-sm font-medium absolute top-2 left-2">
            {day}
          </span>
          {mood !== undefined && (
            <div className="absolute inset-0 flex items-end justify-center pb-2">
              <span className={moodIcons[mood].color}>
                {moodIcons[mood].icon}
              </span>
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={prevMonth}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-4 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-4">
          {renderCalendar()}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Monthly Summary
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          You were mostly feeling <span className="font-medium">{getMoodSummary()}</span> this month.
        </p>
        <div className="mt-6 grid grid-cols-5 gap-4">
          {moodIcons.map((mood, index) => (
            <div key={index} className={`text-center p-3 rounded-xl ${mood.bgColor}`}>
              <span className={`${mood.color} block mb-2`}>{mood.icon}</span>
              <span className="text-sm font-medium text-black">
                {Object.values(moodData).filter(m => m === index).length} days
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}