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
          className="px-3 py-1 bg-surface dark:bg-surface-dark hover:bg-opacity-80 dark:hover:bg-opacity-80 rounded-full text-sm text-primary dark:text-primary-dark font-body transition-colors focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent-dark"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}
