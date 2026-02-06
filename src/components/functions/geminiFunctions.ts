import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Profile, medicine, day } from 'types';

const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.EXPO_PUBLIC_GEMINI_API_KEY}`;

const sampleMedicine: medicine = {
    name: "Amoxicillin",
    quantity: 1,
    times: ["08:00", "20:00"],
    days: ["M", "T", "W", "Th", "F", "S", "Su"]
}

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

export const askGemini = async (dataBase64: string) => {
    try {
        const prompt = `Act as a medical data extractor. Analyze the image and return an JSON objects. Return one JSON object for each medicine found in the image, put all these objects into an array and return an array of JSON objects.
    
        Type Definition:
        type day = "M" | "T" | "W" | "Th" | "F" | "S" | "Su";
        type Medicine = {
            name: string;
            quantity: number;
            times: string[]; // 24h format
            days: day[];
        };

        Constraint: If the image is not a prescription, return: {"name": "not a prescription", "quantity": 0, "times": [], "days": []}

        Example Output:
        ${JSON.stringify(sampleMedicine)}`;

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
                            name: { type: "STRING" },
                            quantity: { type: "NUMBER" },
                            times: { type: "ARRAY", items: { type: "STRING" } },
                            days: { type: "ARRAY", items: { type: "STRING" } },
                        },
                        required: ["name", "quantity", "times", "days"],
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
    }
};