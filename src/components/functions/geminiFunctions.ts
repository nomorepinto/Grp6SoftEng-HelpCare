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
        const prompt = "Analyze the image. Return a JSON that will satisfy the following type: \n\n\ntype Medicine = {\n    name: string;\n    dose: string;\n    frequency: string;\n    duration: string;\n}; if the identified image is not a prescription, set the name to 'not a prescription' and all other values blank";
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
            }]
        };

        const response = await axios.post(url, requestBody);

        console.log(response.data.candidates[0].content.parts[0].text);

    } catch (error: any) {
        // Axios catches 4xx and 5xx errors automatically
        console.error("Status:", error.response?.status);
        console.error("Message:", error.response?.data);
    }
};