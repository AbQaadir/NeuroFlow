export type QuestionType = 'text' | 'textarea' | 'dropdown' | 'radio';

export interface DeepThinkQuestion {
    id: string;
    text: string;
    type: QuestionType;
    options?: string[]; // For dropdown/radio
    required?: boolean;
    placeholder?: string;
    allowMultiple?: boolean; // Allow selecting multiple answers
    predictedAnswers?: string[]; // AI suggested answers
}

export interface DeepThinkResponse {
    questions: DeepThinkQuestion[];
    analysis?: string; // Analysis if questions are skipped
}

export interface DeepThinkAnswers {
    [questionId: string]: string;
}
