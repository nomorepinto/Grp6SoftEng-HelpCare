import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { medicine, sampleMedicine } from '../../../types';


const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.EXPO_PUBLIC_GEMINI_API_KEY}`;



export const testGemini = async () => {
    try {
        const requestBody = {
            contents: [{
                role: "user",
                parts: [
                    { text: "Name 5 fruits." },
                ]
            }]
        };

        const response = await axios.post(url, requestBody);

        console.log(response.data.candidates[0].content.parts[0].text);
    } catch (error: any) {
        console.error("Status:", error.response?.status);
        console.error("Message:", error.response?.data);
    }
}

export const askGemini = async (dataBase64: string): Promise<medicine[]> => {
    try {
        const prompt = `Act as a medical data extractor. Analyze the image and return a JSON array of medicine objects.
    
        Type Definition:
        type day = "M" | "T" | "W" | "Th" | "F" | "S" | "Su";
        type MedicineTime = {
            time: string; // HH:mm 24h format
            isTaken: boolean; // always false
        };
        type Medicine = {
            id: string; // generate a random unique string id
            name: string;
            totalQuantity: number; // total quantity of pills/medicine
            times: MedicineTime[];
            days: day[];
            amountRemaining: number; // same as totalQuantity
            amountTaken: number; // always 0
            color: string; // suggest a tailwind bg color (e.g., bg-blue-500)
        };

        Constraint: If the image is not a prescription, return: [{"id": "error", "name": "not a prescription", "totalQuantity": 0, "times": [], "days": [], "amountRemaining": 0, "amountTaken": 0, "color": "bg-gray-200"}]

        Example Output:
        ${JSON.stringify([sampleMedicine])}`;

        const requestBody = {
            contents: [{
                role: "user",
                parts: [
                    { text: prompt },
                    {
                        inlineData: {
                            data: dataBase64, // Ensure this is just the base64 string, no "data:image/jpeg;base64," prefix
                            mimeType: "image/jpeg"
                        }
                    }
                ]
            }],
            generationConfig: {
                response_mime_type: "application/json",
                response_schema: {
                    type: "ARRAY",
                    items: {
                        type: "OBJECT",
                        properties: {
                            id: { type: "STRING" },
                            name: { type: "STRING" },
                            totalQuantity: { type: "NUMBER" },
                            times: {
                                type: "ARRAY",
                                items: {
                                    type: "OBJECT",
                                    properties: {
                                        time: { type: "STRING" },
                                        isTaken: { type: "BOOLEAN" }
                                    },
                                    required: ["time", "isTaken"]
                                }
                            },
                            days: { type: "ARRAY", items: { type: "STRING" } },
                            amountRemaining: { type: "NUMBER" },
                            amountTaken: { type: "NUMBER" },
                            color: { type: "STRING" }
                        },
                        required: ["id", "name", "totalQuantity", "times", "days", "amountRemaining", "amountTaken", "color"],
                    },
                },
            },
        };

        const response = await axios.post(url, requestBody);
        const result: medicine[] = JSON.parse(response.data.candidates[0].content.parts[0].text);
        console.log(result);
        return result;

    } catch (error: any) {
        // Axios catches 4xx and 5xx errors automatically
        console.error("Status:", error.response?.status);
        console.error("Message:", error.response?.data);
        return [];
    }
};