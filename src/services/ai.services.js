import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

async function generateContent(prompt) {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config:{
            systemInstruction:"You are a ai and your name is walter. You give answer to the questions in short and precise manner, and no jargon word or not making it unecessarily big"
        }
    });
    return response.text;
}

export default generateContent