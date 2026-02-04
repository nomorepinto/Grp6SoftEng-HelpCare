import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Image, ScrollView, Pressable } from 'react-native';
import Button from '@/components/button';
import WarningModal from '@/components/warningModal';
import PhotoModal from '@/components/photoModal';
import { GoogleGenAI } from "@google/genai/web";

export default function PrescriptionPic() {
    const [permission, requestPermission] = useCameraPermissions();
    const [tutorialModalVisible, setTutorialModalVisible] = useState(false);
    const [photos, setPhotos] = useState<string[]>([]);
    const [photoModalVisible, setPhotoModalVisible] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState<string>('');
    const cameraRef = useRef<CameraView>(null);
    const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });

    async function analyzePhoto() {
        // 1. Initialize the model first
        const response = await genAI.models.generateContent({
            model: "gemini-1.5-flash", // Use the correct model string
            contents: [{ role: "user", parts: [{ text: "what do you think of jeffrey epstein?" }] }]
        });
        // Note: response.text is a property here, not a function
        console.log(response.text);
    }

    async function takePicture() {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync();
            console.log(photo);
            setPhotos([...photos, photo.uri]);
        }
    }

    useEffect(() => {
        setTutorialModalVisible(true);
    }, []);

    if (!permission) {
        // Camera permissions are still loading.
        return <View className="flex-1 bg-white" />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View className="flex-1 justify-center items-center px-6 bg-white">
                <Text className="text-center pb-6 text-pink-500 font-Milliard-Medium text-xl">
                    We need your permission to show the camera
                </Text>
                <Button placeholder="Grant Permission" onPress={requestPermission} width="w-3/4" />
            </View>
        );
    }

    function deletePhoto() {
        setPhotos(photos.filter((photo) => photo !== selectedPhoto));
        setSelectedPhoto('');
        setPhotoModalVisible(false);
    }

    return (
        <View className="flex-1">
            <CameraView style={styles.camera} facing={'back'} ref={cameraRef} />
            <View className="flex flex-col justify-center items-center bg-transparent h-[35%] w-[90%] ml-5">
                <View className="flex flex-row gap-5 border border-pink-500 rounded-3xl mb-2 px-3 py-2 min-h-32">
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ gap: 5 }}
                        className="rounded-xl"
                    >
                        {photos.map((photo, index) => (
                            <Pressable key={index} onPress={() => { setSelectedPhoto(photo); setPhotoModalVisible(true) }}>
                                <Image source={{ uri: photo }} className="w-20 h-28 rounded-lg border border-white" resizeMode="cover" />
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>
                <View className="flex flex-col gap-2 justify-center items-center w-full">
                    <Button placeholder="Take Picture" onPress={() => takePicture()} width="w-full" />
                    <Button placeholder="Upload Photos" onPress={() => { analyzePhoto() }} width="w-full" />
                </View>
            </View>
            <WarningModal header='Tutorial' isOpen={tutorialModalVisible} onClose={() => setTutorialModalVisible(false)} text="Take a picture of your prescription to automatically add your medicine schedule" />
            <PhotoModal isOpen={photoModalVisible} onClose={() => setPhotoModalVisible(false)} photo={selectedPhoto} deletePhoto={deletePhoto} />
        </View>
    );
}

const styles = StyleSheet.create({
    camera: {
        flex: 1,
    },
});
