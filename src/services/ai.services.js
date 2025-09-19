import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

async function generateContent(prompt) {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
            systemInstruction: "You are Walter, an AI assistant. Always respond in short, clear, and precise sentences. Avoid jargon and unnecessary complexity. Keep answers simple and to the point."
        }
    });
    return response.text;
}

export default generateContent