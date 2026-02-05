import React, { useState } from 'react';
import { Star, MessageSquare, X } from 'lucide-react';

interface FeedbackRatingProps {
    onSubmit: (rating: number, comment: string) => void;
    onDismiss: () => void;
    isVisible: boolean;
}

export const FeedbackRating: React.FC<FeedbackRatingProps> = ({
    onSubmit,
    onDismiss,
    isVisible
}) => {
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState('');
    const [hoveredRating, setHoveredRating] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isVisible) return null;

    const handleSubmit = () => {
        if (rating === 0) return;
        setIsSubmitting(true);
        // Simulate a small delay or just submit immediately
        setTimeout(() => {
            onSubmit(rating, comment);
            setIsSubmitting(false);
            setRating(0);
            setComment('');
        }, 500);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-2 fade-in duration-300">
            <div className="bg-slate-950 dark:bg-white border border-border/50 shadow-lg rounded-xl p-4 w-80 backdrop-blur-sm">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="text-sm font-semibold text-white dark:text-black">Rate this diagram</h3>
                        <p className="text-xs text-slate-400 dark:text-slate-600">Help AI improve accurately</p>
                    </div>
                    <button
                        onClick={onDismiss}
                        className="text-slate-400 hover:text-white dark:text-slate-500 dark:hover:text-black p-1 rounded-full hover:bg-white/10 dark:hover:bg-black/10 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Stars */}
                <div className="flex justify-center gap-2 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            className="focus:outline-none transition-transform hover:scale-110"
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            onClick={() => setRating(star)}
                        >
                            <Star
                                className={`w-6 h-6 transition-colors ${star <= (hoveredRating || rating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-slate-600 dark:text-slate-400'
                                    }`}
                            />
                        </button>
                    ))}
                </div>

                {/* Comment Input */}
                <div className="relative mb-3">
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Optional feedback..."
                        className="w-full text-xs bg-black/20 dark:bg-white/10 text-white dark:text-black border border-white/10 dark:border-black/10 placeholder:text-slate-500 dark:placeholder:text-slate-400 rounded-lg p-2 resize-none focus:ring-1 focus:ring-primary focus:border-primary outline-none h-16"
                    />
                    <MessageSquare className="w-3 h-3 absolute bottom-2 right-2 text-slate-500 dark:text-slate-400 pointer-events-none" />
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={handleSubmit}
                        disabled={rating === 0 || isSubmitting}
                        className="text-xs bg-white text-black dark:bg-black dark:text-white px-3 py-1.5 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all w-full"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                </div>
            </div>
        </div>
    );
};
