import React from 'react';
import { Modal, View, Text, Pressable, Image } from 'react-native';
import Button from './button';

interface PhotoModalProps {
    isOpen: boolean;
    onClose: () => void;
    photo: any;
    deletePhoto: any;
}

export default function PhotoModal({ isOpen, onClose, photo, deletePhoto }: PhotoModalProps) {
    if (photo === undefined) {
        return null;
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isOpen}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center">
                <View className="w-[72%] mb-36">
                    <View className="bg-white w-full rounded-3xl p-2 items-center shadow-lg">
                        <Image source={{ uri: photo.uri }} className="h-96 w-72 rounded-3xl" resizeMode='cover' />
                        <View className="flex flex-row justify-between w-full mt-5">
                            <Button
                                placeholder="Delete"
                                onPress={deletePhoto}
                                width="w-[45%]"
                            />
                            <Button
                                placeholder="Close"
                                onPress={onClose}
                                width="w-[45%]"
                            />
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
