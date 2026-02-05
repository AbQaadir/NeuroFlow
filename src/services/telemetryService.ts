import { set, get, update } from 'idb-keyval';
import { ArchitectureSchema } from '../types';

export interface GenerationEvent {
    id: string;
    timestamp: number;
    agentType: string;
    inputPrompt: string;
    outputJson: ArchitectureSchema; // The raw output
    latencyMs: number;
    status: 'success' | 'failure';
    errorMessage?: string;
    finalJson?: ArchitectureSchema; // Captured at session end
    userRating?: number; // 1-5
    userComments?: string;
}

const STORAGE_KEY = 'neuroflow_telemetry_v1';

export const telemetryService = {
    /**
     * Log a new generation event start/completion
     */
    logGeneration: async (event: GenerationEvent) => {
        try {
            await update(STORAGE_KEY, (events: GenerationEvent[] = []) => {
                return [...events, event];
            });
            // console.log('[Telemetry] Logged generation:', event.id);
        } catch (err) {
            console.warn('[Telemetry] Failed to log generation:', err);
        }
    },

    /**
     * Update an existing event (e.g., with feedback or final state)
     */
    updateEvent: async (id: string, updates: Partial<GenerationEvent>) => {
        try {
            await update(STORAGE_KEY, (events: GenerationEvent[] = []) => {
                return events.map(e => e.id === id ? { ...e, ...updates } : e);
            });
        } catch (err) {
            console.warn('[Telemetry] Failed to update event:', err);
        }
    },

    /**
     * Get all logs for export
     */
    getAllLogs: async (): Promise<GenerationEvent[]> => {
        return (await get(STORAGE_KEY)) || [];
    },

    /**
     * Clear all logs
     */
    clearLogs: async () => {
        await set(STORAGE_KEY, []);
    },

    /**
     * Export logs as a JSON file download
     */
    downloadLogs: async () => {
        const logs = await telemetryService.getAllLogs();
        const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `neuroflow_research_data_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};
