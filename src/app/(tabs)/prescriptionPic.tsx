import { useState, useRef } from 'react';
import { View, Text } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import Button from '@/components/button';

function PrescriptionPic() {
    const [permission, requestPermission] = useCameraPermissions();
    const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
    const cameraRef = useRef<CameraView>(null); //token error fix

    const takePhoto = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync();
            console.log(photo);
        }
    };

    if (!permission || !mediaPermission) {
        return (
            <View className="flex-1 justify-center items-center px-6">
                <View className="bg-white w-full rounded-3xl p-6 items-center shadow-lg">
                    <Text className="text-pink-500 text-3xl font-Milliard-ExtraBold mb-4 text-center">
                        Warning
                    </Text>
                    <Text className="text-slate-700 text-xl font-Milliard-Medium mb-8 text-center">
                        Camera and Media Library permissions are required to use this feature.
                    </Text>
                    <Button
                        placeholder="Close"
                        onPress={() => { requestPermission(); requestMediaPermission() }}
                        width="w-1/2"
                    />
                </View>
            </View>
        );
    }
}


