'use client';

interface QuickReplyChipsProps {
  suggestions: string[];
  onSelectSuggestion: (suggestion: string) => void;
}

export default function QuickReplyChips({ suggestions, onSelectSuggestion }: QuickReplyChipsProps) {
  if (!suggestions || suggestions.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2 mb-4 px-4" aria-label="Suggested replies">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelectSuggestion(suggestion)}
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full text-sm text-gray-700 dark:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}
