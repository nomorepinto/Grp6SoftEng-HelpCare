import axios from 'axios';
import { File } from 'expo-file-system';

const apiKey = () => {
    try {
        return process.env.EXPO_PUBLIC_GEMINI_API_KEY;
    } catch (error: any) {
        console.log("No API key found.")
    }
}

const convertUriToBase64 = async (uri: string) => {
    const file = new File(uri);
    const base64 = await file.base64();
    return base64;
};

export const askGemini = async (prompt: string) => {
    try {
        const response = await axios.post(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
            {
                contents: [{ parts: [{ text: prompt }] }]
            },
            {
                params: { key: apiKey() }
            }
        );

        // Axios automatically parses JSON, so you go straight to .data
        console.log(response.data.candidates[0].content.parts[0].text);
    } catch (error: any) {
        // Axios catches 4xx and 5xx errors automatically
        console.error("Status:", error.response?.status);
        console.error("Message:", error.response?.data);
    }
};