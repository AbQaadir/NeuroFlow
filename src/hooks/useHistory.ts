import { useState, useCallback } from 'react';

interface HistoryState<T> {
    past: T[];
    future: T[];
}

export function useHistory<T>() {
    const [history, setHistory] = useState<HistoryState<T>>({
        past: [],
        future: [],
    });

    const canUndo = history.past.length > 0;
    const canRedo = history.future.length > 0;

    const takeSnapshot = useCallback((currentState: T) => {
        setHistory(prev => ({
            past: [...prev.past, currentState],
            future: []
        }));
    }, []);

    const undo = useCallback((currentState: T): T | null => {
        // We need to access the state from the setter to ensure we have the latest
        // But here we rely on the closure 'history' which might be stale if not in dependency
        // Actually, better to use functional update or refs if we want to be safe, 
        // but standard React state flow should work if 'undo' is recreated when history changes.
        // The dependency array [history.past, history.future] ensures this.

        if (history.past.length === 0) return null;

        const previous = history.past[history.past.length - 1];
        const newPast = history.past.slice(0, -1);

        setHistory({
            past: newPast,
            future: [currentState, ...history.future]
        });

        return previous;
    }, [history]);

    const redo = useCallback((currentState: T): T | null => {
        if (history.future.length === 0) return null;

        const next = history.future[0];
        const newFuture = history.future.slice(1);

        setHistory({
            past: [...history.past, currentState],
            future: newFuture
        });

        return next;
    }, [history]);

    const clearHistory = useCallback(() => {
        setHistory({ past: [], future: [] });
    }, []);

    return {
        takeSnapshot,
        undo,
        redo,
        canUndo,
        canRedo,
        clearHistory
    };
}
