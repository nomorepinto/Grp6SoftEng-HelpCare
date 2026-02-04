import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import Button from './button';

interface WarningModalProps {
    isOpen: boolean;
    onClose: () => void;
    text: string;
    header: string;
}

export default function WarningModal({ isOpen, onClose, text, header }: WarningModalProps) {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isOpen}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center px-6">
                <View className="bg-white w-full rounded-3xl p-6 items-center shadow-lg">
                    <Text className="text-pink-500 text-3xl font-Milliard-ExtraBold mb-4 text-center">
                        {header}
                    </Text>

                    <Text className="text-slate-700 text-xl font-Milliard-Medium mb-8 text-center">
                        {text}
                    </Text>

                    <Button
                        placeholder="Close"
                        onPress={onClose}
                        width="w-1/2"
                    />
                </View>
            </View>
        </Modal>
    );
}
