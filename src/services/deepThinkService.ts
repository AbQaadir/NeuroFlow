import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AgentType } from "../types";
import { DeepThinkResponse } from "../types/deepThink";
import { getDiagram } from "../diagrams";

const DEEP_THINK_SCHEMA: Schema = {
    type: Type.OBJECT,
    properties: {
        questions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING },
                    text: { type: Type.STRING },
                    type: { type: Type.STRING, enum: ['text', 'textarea', 'dropdown', 'radio'] },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    required: { type: Type.BOOLEAN },
                    placeholder: { type: Type.STRING },
                    allowMultiple: { type: Type.BOOLEAN },
                    predictedAnswers: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["id", "text", "type"]
            }
        }
    },
    required: ["questions"]
};

export const generateDeepThinkQuestions = async (
    agent: AgentType,
    apiKey: string,
    userPrompt: string
): Promise<DeepThinkResponse> => {
    if (!apiKey) {
        throw new Error("API Key is missing.");
    }

    const genAI = new GoogleGenAI({ apiKey });
    const diagramImpl = getDiagram(agent);

    const systemInstruction = `
    You are an expert ${diagramImpl.label} designer.
    Your goal is to help the user generate a high-quality ${diagramImpl.label}.

    Analyze the user's prompt.
    
    Scenario 1: INSUFFICIENT CONTEXT
    If the user's request is vague, generate 3-5 targeted clarifying questions.
    - Focus on scope, key entities, relationships, and constraints.
    - Use 'dropdown'/'radio' for standard patterns, 'text'/'textarea' for details.
    - CRITICAL: For each question, provide 1-3 'predictedAnswers' that are likely correct based on common patterns or the partial context.
    - Set 'allowMultiple' to true if multiple answers are valid.

    Scenario 2: SUFFICIENT CONTEXT
    If the detailed prompt gives enough information to generate a good diagram immediately:
    - Return an EMPTY 'questions' array.
    - Provide a detailed 'analysis' string.

    Return structured JSON matching the schema.
    `;

    try {
        const contents: any[] = [];

        // Add System Instruction as a user part (or config if supported, but here we mix context)
        // Actually, let's keep system instruction in config and build user content.

        const userParts: any[] = [];

        if (userPrompt) {
            userParts.push({ text: `User Prompt: ${userPrompt}` });
        }

        if (userParts.length === 0) {
            userParts.push({ text: "Generate generic clarifying questions for this diagram type." });
        }

        contents.push({ role: 'user', parts: userParts });

        const response = await genAI.models.generateContent({
            model: 'gemini-flash-latest',
            contents: contents,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: DEEP_THINK_SCHEMA,
                temperature: 0.5,
            },
        });

        const text = response.text;
        if (!text) throw new Error("No response from Gemini");

        const data = JSON.parse(text);
        return data as DeepThinkResponse;

    } catch (error: any) {
        console.error("Deep Think API Error:", error);
        throw new Error(error.message || "Failed to generate questions");
    }
};
