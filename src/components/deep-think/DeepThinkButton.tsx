import React from 'react';
import { Sparkles } from 'lucide-react';

interface DeepThinkButtonProps {
    onClick: () => void;
    isLoading?: boolean;
    isActive?: boolean;
}

export const DeepThinkButton: React.FC<DeepThinkButtonProps> = ({ onClick, isLoading, isActive }) => {
    return (
        <button
            onClick={onClick}
            disabled={isLoading}
            className={`
                flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all shadow-sm
                ${isActive
                    ? 'bg-black text-white dark:bg-white dark:text-black ring-2 ring-offset-2 ring-black dark:ring-white'
                    : 'bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90'}
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            title="Deep Think: Ask clarifying questions before generating"
        >
            <Sparkles className={`w-3 h-3 ${isActive ? 'fill-current' : ''}`} />
            Deep Think
        </button>
    );
};
