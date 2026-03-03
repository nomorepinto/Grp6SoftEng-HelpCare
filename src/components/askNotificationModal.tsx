import { Modal, View, Text, Linking, Platform } from 'react-native';
import Button from './button';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AskNotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    neverAskAgain: any;
}

export default function AskNotificationModal({ isOpen, onClose, neverAskAgain }: AskNotificationModalProps) {

    const openSettings = () => {
        if (Platform.OS === 'ios') {
            Linking.openURL('app-settings:');
        } else {
            Linking.openSettings();
        }
    };

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
                        Notifications
                    </Text>

                    <Text className="text-slate-700 text-xl font-Milliard-Medium mb-8 text-center">
                        Please enable notifications to receive reminders about your medicine and appointments.
                    </Text>

                    <View className="flex flex-row justify-between w-full mb-2">
                        <Button
                            placeholder="Close"
                            onPress={() => { onClose(); }}
                            width="w-[48%]"
                        />
                        <Button
                            placeholder="Settings"
                            onPress={openSettings}
                            width="w-[48%]"
                        />
                    </View>
                    <View className="flex flex-row justify-between w-full">
                        <Button
                            placeholder="Don't ask again"
                            onPress={() => { onClose(); neverAskAgain(); }}
                            width="w-full"
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}
