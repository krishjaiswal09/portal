
import React from 'react';

interface ClassFiltersProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  counts?: {
    today: number;
    upcoming: number;
    completed: number;
    cancelled: number;
  };
}

export const ClassFilters: React.FC<ClassFiltersProps> = ({ 
  activeTab, 
  onTabChange,
  counts = { today: 0, upcoming: 0, completed: 0, cancelled: 0 }
}) => {
  const tabs = [
    { id: 'today', label: 'Today', count: counts.today },
    { id: 'upcoming', label: 'Upcoming', count: counts.upcoming },
    { id: 'completed', label: 'Completed', count: counts.completed },
    { id: 'cancelled', label: 'Cancelled', count: counts.cancelled }
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
            ${activeTab === tab.id 
              ? 'bg-white text-orange-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
            }
          `}
        >
          {tab.label} ({tab.count})
        </button>
      ))}
    </div>
  );
};
