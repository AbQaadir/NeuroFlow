import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ArchitectureSchema, AgentType, HistoryItem } from "../types";
import { getDiagram } from "../diagrams";

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    nodes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "Unique identifier (snake_case)" },
          label: { type: Type.STRING, description: "Display name (Table/Class Name)" },
          type: { type: Type.STRING, description: "Node Type (must match Agent rules)" },
          parentId: { type: Type.STRING, description: "ID of the parent group node (optional)" },
          description: { type: Type.STRING, description: "Short description" },

          attributes: {
            type: Type.ARRAY,
            description: "List of columns (DB) or properties (Class)",
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                dataType: { type: Type.STRING },
                isPK: { type: Type.BOOLEAN },
                isFK: { type: Type.BOOLEAN },
                visibility: { type: Type.STRING, description: "For classes: +, -, #" }
              },
              required: ["name", "dataType"]
            }
          },
          methods: {
            type: Type.ARRAY,
            description: "List of methods (Class diagrams only)",
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                returnType: { type: Type.STRING },
                visibility: { type: Type.STRING, description: "+, -, #" }
              },
              required: ["name", "returnType"]
            }
          },
          deleted: { type: Type.BOOLEAN, description: "Set to true to delete this node" }
        },
        required: ["id", "label", "type"]
      }
    },
    edges: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          source: { type: Type.STRING, description: "ID of the source node" },
          target: { type: Type.STRING, description: "ID of the target node" },
          label: { type: Type.STRING, description: "Edge label (e.g., '1:N', 'extends')" },

          deleted: { type: Type.BOOLEAN, description: "Set to true to delete this edge" }
        },
        required: ["source", "target"]
      }
    },
    explanation: {
      type: Type.STRING,
      description: "A concise summary of the generated diagram."
    }
  },
  required: ["nodes", "edges", "explanation"]
};

export interface GenAIResponse {
  schema: ArchitectureSchema;
  explanation: string;
}

export const generateDiagram = async (
  history: HistoryItem[],
  currentContext: ArchitectureSchema,
  agent: AgentType,
  apiKey: string,
  onStatusUpdate?: (status: string) => void
): Promise<GenAIResponse> => {

  if (!apiKey) {
    throw new Error("API Key is missing. Please check your .env.local file and ensure VITE_GEMINI_API_KEY is set.");
  }

  // Initialize Client
  const genAI = new GoogleGenAI({ apiKey });

  // Select Agent Persona from Registry
  const diagramImpl = getDiagram(agent);
  const systemInstruction = diagramImpl.systemInstruction;
  const schema = RESPONSE_SCHEMA;


  try {
    let attempt = 0;
    const maxRetries = 3;
    const baseDelay = 1000; // 1 second

    while (attempt <= maxRetries) {
      try {
        const messages = [
          {
            role: 'user',
            parts: [{
              text: `CURRENT DIAGRAM STATE:\n${JSON.stringify(currentContext, null, 2)}\n\nIMPORTANT: The above is the current state. Based on the conversation below, return ONLY the modifications (deltas).`
            }]
          },
          ...history.map(item => ({
            role: item.role,
            parts: item.parts
          }))
        ];

        const response = await genAI.models.generateContent({
          model: 'gemini-flash-latest',
          contents: messages,
          config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            responseSchema: schema,
            temperature: 0.2,
            maxOutputTokens: 8192,
          },
        });

        const text = response.text;

        if (!text) throw new Error("No response from Gemini");

        let data;
        try {
          data = JSON.parse(text);
          // console.log("LLM Structured Output:", data);
        } catch (parseError) {
          console.error("JSON Parse Error (likely truncated):", text);
          throw new Error("The diagram is too complex and the response was cut off. Please try a simpler request or ask for a specific part of the diagram.");
        }

        return {
          schema: {
            nodes: data.nodes || [],
            edges: data.edges || []
          },
          explanation: data.explanation || "Diagram updated."
        };

      } catch (error: any) {
        const isOverloaded = error.message?.includes('503') || error.message?.includes('429') || error.status === 503 || error.status === 429;

        if (isOverloaded && attempt < maxRetries) {
          attempt++;
          const delay = baseDelay * Math.pow(2, attempt - 1); // 1s, 2s, 4s
          const msg = `Model overloaded. Retrying in ${delay / 1000}s... (Attempt ${attempt}/${maxRetries})`;
          console.warn(msg);
          if (onStatusUpdate) onStatusUpdate(msg);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        throw error; // Re-throw if not retriable or max retries reached
      }
    }
    throw new Error("Failed to generate diagram after multiple attempts.");
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to generate diagram");
  }
};

/**
 * Uses Gemini Vision to describe an image for diagram generation context.
 * @param base64Image The image data (without data:image/xxx;base64 prefix)
 * @param mimeType The mime type of the image (e.g., 'image/jpeg')
 * @param apiKey Google AI API Key
 */
export const describeImage = async (
  base64Image: string,
  mimeType: string,
  apiKey: string,
  userPrompt: string = "Describe this software architecture/flowchart in detail so I can recreate it."
): Promise<string> => {
  if (!apiKey) throw new Error("API Key is missing.");

  const genAI = new GoogleGenAI({ apiKey });

  try {
    const result = await genAI.models.generateContent({
      model: "gemini-flash-latest",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Image
              }
            },
            { text: userPrompt }
          ]
        }
      ]
    });

    return result.text || "";
  } catch (error: any) {
    console.error("Gemini Vision Error:", error);
    throw new Error("Failed to analyze image: " + error.message);
  }
};