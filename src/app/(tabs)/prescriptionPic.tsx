import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Text, View, StyleSheet, Image, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import Button from '@/components/button';
import WarningModal from '@/components/warningModal';
import PhotoModal from '@/components/photoModal';
import { askGemini } from '@/components/functions/geminiFunctions';
import { useFocusEffect } from 'expo-router';
import { medicine, Profile, sampleMedicine } from 'types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';


export default function PrescriptionPic() {
    const router = useRouter();
    const [permission, requestPermission] = useCameraPermissions();
    const [tutorialModalVisible, setTutorialModalVisible] = useState(false);
    const [photos, setPhotos] = useState<any>([]);
    const [photoModalVisible, setPhotoModalVisible] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState<string>('');
    const cameraRef = useRef<CameraView>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [warningModalVisible, setWarningModalVisible] = useState(false);
    const [warningText, setWarningText] = useState("");

    const isAnyModalOpen = tutorialModalVisible || photoModalVisible || warningModalVisible;

    const opacity = useSharedValue(1);

    useEffect(() => {
        opacity.value = withTiming(isAnyModalOpen ? 0.5 : 1, { duration: 300 });
    }, [isAnyModalOpen]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    const saveMedicineToProfile = async (newMedicine: medicine) => {
        // ... (trimmed)

        try {
            const profileArray = JSON.parse(await AsyncStorage.getItem("profileArray") ?? "[]");
            if (profileArray.length > 0) {
                const currentProfile = profileArray.find((profile: Profile) => profile.isSelected);
                if (currentProfile) {
                    currentProfile.medicineSchedule.push(newMedicine);
                    await AsyncStorage.setItem("profileArray", JSON.stringify(profileArray));
                    console.log("New Medicine Added")
                }
            }
        } catch (error) {
            console.error("Error saving medicine:", error);
        }
    }

    async function uploadPhotos(photo: any) {
        setIsLoading(true);
        try {
            const arrayOfMedicine: medicine[] = await askGemini(photo.base64) ?? [];
            for (const med of arrayOfMedicine) {
                if (med.name !== "not a prescription") {
                    await saveMedicineToProfile(med);
                } else {
                    setWarningText("The image does not appear to be a prescription.");
                    setWarningModalVisible(true);
                }
            }
        } catch (error) {
            setWarningText("Failed to upload photos.");
            setWarningModalVisible(true);
            console.error("Error uploading photos:", error);
        } finally {
            setIsLoading(false);
            router.replace("/medStock");
        }
    }

    async function takePicture() {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync({
                quality: 1,
                base64: true,
            });
            setPhotos([...photos, photo]);
            console.log("Photo Taken" + photos.length);
        }
    }

    useFocusEffect(
        useCallback(() => {
            setTutorialModalVisible(true);
        }, [])
    );

    if (!permission) {
        // Camera permissions are still loading.
        return <View className="flex-1 bg-pink-50" />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View className="flex-1 justify-center items-center px-6 bg-white">
                <Text className="text-center pb-6 text-pink-500 font-Milliard-Medium text-xl">
                    We need your permission to show the camera
                </Text>
                <Button placeholder="Grant Permission" onPress={requestPermission} width="w-3/4" />
                <Button placeholder="Skip" onPress={() => router.push("/medStock")} width="w-3/4 mt-2" />
            </View>
        );
    }

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#FF69B4" />
                <Text className="text-pink-500 font-Milliard-Medium text-lg opacity-50 mt-6">Extracting Medicine Schedule...</Text>
            </View>
        );
    }

    function deletePhoto() {
        setPhotos(photos.filter((photo: any) => photo !== selectedPhoto));
        setSelectedPhoto('');
        setPhotoModalVisible(false);
    }

    return (
        <Animated.View style={[{ flex: 1 }, animatedStyle]}>
            <View className="flex-1 bg-white">
                <CameraView style={styles.camera} facing={'back'} ref={cameraRef} />
                <View className="flex flex-col justify-center items-center bg-transparent h-[36%] w-[90%] ml-5">
                    <View className="flex flex-row gap-5 border border-pink-500 rounded-3xl mb-2 px-3 py-2 min-h-32">
                        {photos.length === 0 ? (
                            <View className="w-full justify-self-center self-center text-center justify-center items-center">
                                <Text className="text-pink-500 font-Milliard-Heavy text-2xl opacity-50">No photos taken yet</Text>
                            </View>
                        ) : (
                            <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ gap: 5 }}
                                className="rounded-xl border"
                            >
                                {
                                    photos.map((photo: any, index: any) => (
                                        <Pressable key={index} onPress={() => { setSelectedPhoto(photo.uri); setPhotoModalVisible(true) }}>
                                            <Image source={{ uri: photo.uri }} className="w-20 h-28 rounded-lg border border-white" resizeMode="cover" />
                                        </Pressable>
                                    ))
                                }
                            </ScrollView>
                        )}
                    </View>
                    <View className="flex flex-col gap-2 justify-center items-center w-full">
                        <Button placeholder="Take Picture" onPress={() => takePicture()} width="w-full" />
                        <Button placeholder="Upload Photos"
                            onPress={() => {
                                photos.length > 0 ? photos.map((photo: any) => uploadPhotos(photo)) : setWarningText("No photos taken yet"); setWarningModalVisible(true);
                            }}
                            width="w-full" />

                    </View>
                    <View className="flex flex-col gap-2 justify-center items-end w-full mt-2">
                        <Button placeholder="Skip" onPress={() => router.push("/medStock")} width="w-1/2" />
                    </View>
                </View>
                <WarningModal header='Tutorial' isOpen={tutorialModalVisible} onClose={() => setTutorialModalVisible(false)} text="Take a picture of your prescription to automatically add your medicine schedule" />
                <WarningModal header={warningText} isOpen={warningModalVisible} onClose={() => setWarningModalVisible(false)} text="Please try again." />
                <PhotoModal isOpen={photoModalVisible} onClose={() => setPhotoModalVisible(false)} photo={selectedPhoto} deletePhoto={deletePhoto} />
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    camera: {
        flex: 1,
    },
});
