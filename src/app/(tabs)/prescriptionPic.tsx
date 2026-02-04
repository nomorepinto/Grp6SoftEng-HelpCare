import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import Button from '@/components/button';

export default function PrescriptionPic() {
    const [permission, requestPermission] = useCameraPermissions();
    const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
    const [cameraType, setCameraType] = useState<CameraType>('back');
    const cameraRef = useRef<CameraView>(null); //token error fix

    const toggleCameraType = () => {
        setCameraType(current => (current === 'back' ? 'front' : 'back'));
    };

    const takePhoto = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync();
            console.log(photo);
        }
    };
    if (!permission) {
        return <View />
    }

    if (!permission?.granted) {
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
                        onPress={() => { requestPermission() }}
                        width="w-1/2"
                    />
                </View>
            </View>
        );
    }

    return (
        <View className="flex-1 w-full h-full justify-center items-center px-6">
            <CameraView className="flex-1 w-full h-full" facing={cameraType} ref={cameraRef} />
            <View className="flex flex-row justify-between">
                <TouchableOpacity className="bg-pink-500 p-3 rounded-lg" onPress={toggleCameraType}>
                    <Text className="text-white text-xl font-Milliard-Medium">Flip Camera</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}


