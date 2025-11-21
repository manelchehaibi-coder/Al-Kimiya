import { GoogleGenAI, Type } from "@google/genai";
import { ChemicalElement, GeminiElementDetails } from '../types';

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.error("API Key is missing");
        throw new Error("Clé API manquante. Veuillez configurer l'API Key.");
    }
    return new GoogleGenAI({ apiKey });
};

export const fetchElementDetails = async (element: ChemicalElement): Promise<GeminiElementDetails> => {
    const ai = getClient();
    const prompt = `Provide detailed information about the chemical element ${element.nameFr} (${element.symbol}). 
    I need the response in a structured JSON format containing a description, applications, and a fun fact in both French and Arabic.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        descriptionFr: { type: Type.STRING, description: "Scientific description in French (approx 50 words)" },
                        descriptionAr: { type: Type.STRING, description: "Scientific description in Arabic (approx 50 words)" },
                        applicationsFr: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of 3 common uses in French" },
                        applicationsAr: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of 3 common uses in Arabic" },
                        funFactFr: { type: Type.STRING, description: "A short fun or historical fact in French" },
                        funFactAr: { type: Type.STRING, description: "A short fun or historical fact in Arabic" },
                    },
                    required: ["descriptionFr", "descriptionAr", "applicationsFr", "applicationsAr", "funFactFr", "funFactAr"],
                },
            },
        });

        const text = response.text;
        if (!text) throw new Error("No response from Gemini");
        return JSON.parse(text) as GeminiElementDetails;
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
};
