import React, { useState } from 'react';
import { DeepThinkQuestion, DeepThinkAnswers } from '../../types/deepThink';
import { Send, X } from 'lucide-react';

interface DeepThinkFormProps {
    questions: DeepThinkQuestion[];
    onSubmit: (answers: DeepThinkAnswers) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

export const DeepThinkForm: React.FC<DeepThinkFormProps> = ({ questions, onSubmit, onCancel, isSubmitting }) => {
    const [answers, setAnswers] = useState<DeepThinkAnswers>({});

    const handleChange = (id: string, value: string | string[]) => {
        setAnswers(prev => ({ ...prev, [id]: Array.isArray(value) ? value.join(', ') : value }));
    };

    const toggleAnswer = (id: string, value: string, allowMultiple?: boolean) => {
        const current = answers[id] || '';
        const currentArray = current ? current.split(', ').filter(Boolean) : [];

        if (allowMultiple) {
            if (currentArray.includes(value)) {
                handleChange(id, currentArray.filter(v => v !== value));
            } else {
                handleChange(id, [...currentArray, value]);
            }
        } else {
            handleChange(id, value);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(answers);
    };

    return (
        <div className="flex flex-col h-full bg-background animate-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between shrink-0 bg-sidebar-accent/50">
                <div>
                    <h3 className="font-semibold text-foreground">Deep Think Mode</h3>
                    <p className="text-xs text-muted-foreground">Please answer a few questions to refine the diagram.</p>
                </div>
                <button
                    onClick={onCancel}
                    className="p-1 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <form id="deep-think-form" onSubmit={handleSubmit} className="space-y-6">
                    {questions.map((q) => (
                        <div key={q.id} className="space-y-2">
                            <label className="block text-sm font-medium text-foreground">
                                {q.text}
                                {q.required && <span className="text-red-500 ml-1">*</span>}
                            </label>

                            {q.type === 'text' && (
                                <div className="space-y-2">
                                    {q.predictedAnswers && q.predictedAnswers.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {q.predictedAnswers.map(ans => (
                                                <button
                                                    key={ans}
                                                    type="button"
                                                    onClick={() => toggleAnswer(q.id, ans, q.allowMultiple)}
                                                    className={`
                                                        px-3 py-1 rounded-full text-xs font-medium border transition-all
                                                        ${(answers[q.id] || '').includes(ans)
                                                            ? 'bg-black text-white dark:bg-white dark:text-black border-transparent'
                                                            : 'bg-background border-border text-muted-foreground hover:border-black hover:text-black dark:hover:border-white dark:hover:text-white'}
                                                    `}
                                                >
                                                    {ans}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    <input
                                        type="text"
                                        required={q.required}
                                        placeholder={q.placeholder || "Type your answer..."}
                                        value={answers[q.id] || ''}
                                        onChange={(e) => handleChange(q.id, e.target.value)}
                                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            )}

                            {q.type === 'textarea' && (
                                <div className="space-y-2">
                                    {q.predictedAnswers && q.predictedAnswers.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {q.predictedAnswers.map(ans => (
                                                <button
                                                    key={ans}
                                                    type="button"
                                                    onClick={() => toggleAnswer(q.id, ans, q.allowMultiple)}
                                                    className={`
                                                        px-3 py-1 rounded-full text-xs font-medium border transition-all
                                                        ${(answers[q.id] || '').includes(ans)
                                                            ? 'bg-black text-white dark:bg-white dark:text-black border-transparent'
                                                            : 'bg-background border-border text-muted-foreground hover:border-black hover:text-black dark:hover:border-white dark:hover:text-white'}
                                                    `}
                                                >
                                                    {ans}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    <textarea
                                        required={q.required}
                                        placeholder={q.placeholder || "Type your answer..."}
                                        rows={3}
                                        value={answers[q.id] || ''}
                                        onChange={(e) => handleChange(q.id, e.target.value)}
                                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                                    />
                                </div>
                            )}

                            {q.type === 'dropdown' && (
                                <select
                                    required={q.required}
                                    value={answers[q.id] || ''}
                                    onChange={(e) => handleChange(q.id, e.target.value)}
                                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                >
                                    <option value="" disabled>Select an option</option>
                                    {q.options?.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            )}

                            {q.type === 'radio' && (
                                <div className="space-y-2">
                                    {q.options?.map(opt => (
                                        <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                                            <input
                                                type="radio"
                                                name={q.id}
                                                value={opt}
                                                checked={answers[q.id] === opt}
                                                onChange={(e) => handleChange(q.id, e.target.value)}
                                                className="text-primary focus:ring-primary"
                                            />
                                            {opt}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </form>
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-background shrink-0">
                <button
                    type="submit"
                    form="deep-think-form"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                    <Send className="w-4 h-4" />
                    {isSubmitting ? 'Generating Diagram...' : 'Submit & Generate'}
                </button>
            </div>
        </div>
    );
};
