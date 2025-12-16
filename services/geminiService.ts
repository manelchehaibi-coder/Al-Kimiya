import { GoogleGenAI, Type, Modality } from "@google/genai";
import { ChemicalElement, GeminiElementDetails, ChemicalCompound } from '../types';

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.error("API Key is missing");
        throw new Error("Clé API manquante. Veuillez configurer l'API Key.");
    }
    return new GoogleGenAI({ apiKey });
};

export const fetchAudioForText = async (text: string): Promise<string> => {
    const ai = getClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
            },
        });
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) {
            throw new Error("No audio data received from Gemini TTS.");
        }
        return base64Audio;
    } catch (error) {
        console.error(`Gemini TTS API Error for text "${text}":`, error);
        throw error;
    }
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

export const combineElements = async (elements: ChemicalElement[]): Promise<ChemicalCompound> => {
    const ai = getClient();
    const symbols = elements.map(e => e.symbol).join(', ');
    
    // Prompt engineered to be forgiving with stoichiometry (e.g., H + O -> Water)
    const prompt = `You are a chemistry engine. The user has combined these elements: [${symbols}]. 
    Determine the most likely chemical compound they are trying to create (ignore perfect stoichiometry, assume standard conditions).
    For example, if inputs are H and O, assume H2O (Water). If Na and Cl, assume NaCl.
    If the combination creates a known compound, return success: true.
    If these elements are Noble Gases or do not react typically under standard conditions, return success: false.
    Return the result in JSON.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        success: { type: Type.BOOLEAN },
                        nameFr: { type: Type.STRING, description: "Name of compound in French" },
                        nameAr: { type: Type.STRING, description: "Name of compound in Arabic" },
                        formula: { type: Type.STRING, description: "Chemical formula like H2O" },
                        descriptionFr: { type: Type.STRING, description: "Brief description of the compound/reaction in French" },
                        descriptionAr: { type: Type.STRING, description: "Brief description of the compound/reaction in Arabic" },
                        state: { type: Type.STRING, description: "State at room temp (Liquid, Gas, Solid)" },
                        errorFr: { type: Type.STRING, description: "Reason for failure in French (optional)" },
                        errorAr: { type: Type.STRING, description: "Reason for failure in Arabic (optional)" },
                    },
                    required: ["success"],
                },
            },
        });

         const text = response.text;
        if (!text) throw new Error("No response from Gemini");
        return JSON.parse(text) as ChemicalCompound;
    } catch (error) {
        console.error("Gemini Mixing Error:", error);
        throw error;
    }
}