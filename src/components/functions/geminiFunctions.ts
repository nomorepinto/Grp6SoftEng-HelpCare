import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


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

export const askGemini = async (dataBase64: string) => {
    try {
        const prompt = `Analyze the image. Identify all medicines and their schedules. 
        Return ONLY a JSON array of objects satisfying this type:
        type Day = "M" | "T" | "W" | "Th" | "F" | "S" | "Su";
        type MedicineTime = { time: string; isTaken: boolean; };
        type Medicine = {
            id: string; // generate a random id
            name: string;
            quantity: number;
            times: MedicineTime[];
            days: Day[];
            amountBought: number;
            amountRemaining: number;
            color: string; // suggest a tailwind bg color like 'bg-blue-200'
        };
        If the image is not a prescription, return: [{"name": "not a prescription"}]
        For the 'time' field, use "HH:mm" 24-hour format. Set 'isTaken' to false.`;

        const requestBody = {
            contents: [{
                role: "user",
                parts: [
                    { text: prompt },
                    {
                        inlineData: {
                            data: dataBase64,
                            mimeType: "image/jpeg"
                        }
                    }
                ]
            }],
            generationConfig: {
                responseMimeType: "application/json",
            }
        };

        const response = await axios.post(url, requestBody);
        const result = response.data.candidates[0].content.parts[0].text;
        return JSON.parse(result);

    } catch (error: any) {
        console.error("Status:", error.response?.status);
        console.error("Message:", error.response?.data);
        return null;
    }
};