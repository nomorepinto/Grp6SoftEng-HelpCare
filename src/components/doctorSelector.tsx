import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import { doctor } from 'types';
import Button from './button';

interface DoctorSelectorProps {
    doctors: doctor[];
    selectDoctor: (doctor: doctor) => void;
    isOpen: boolean;
    onClose: () => void;
}

export default function DoctorSelector({ doctors, selectDoctor, isOpen, onClose }: DoctorSelectorProps) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isOpen}
            onRequestClose={onClose}
        >
            <Pressable
                className="flex-1 justify-center items-center bg-black/40"
                onPress={onClose}
            >
                <Pressable
                    className="bg-white w-5/6 max-h-[70%] rounded-3xl p-6 shadow-2xl"
                    onPress={(e) => e.stopPropagation()}
                >
                    <Text className="text-pink-500 text-2xl font-Milliard-ExtraBold mb-4 text-center">
                        Select Doctor
                    </Text>

                    {doctors.length === 0 ? (
                        <View className="py-10 items-center">
                            <Text className="text-gray-400 font-Milliard-Medium text-center">
                                No doctors added yet.
                            </Text>
                        </View>
                    ) : (
                        <ScrollView
                            className="w-full"
                            showsVerticalScrollIndicator={false}
                        >
                            <View className="gap-3">
                                {doctors.map((doctor) => (
                                    <TouchableOpacity
                                        key={doctor.id}
                                        onPress={() => {
                                            selectDoctor(doctor);
                                            onClose();
                                        }}
                                        className={`p-4 rounded-2xl flex-row items-center border border-gray-100 ${doctor.color || 'bg-pink-50'}`}
                                    >
                                        <View className="flex-1">
                                            <Text className="text-gray-800 font-Milliard-Bold text-lg">
                                                {doctor.name}
                                            </Text>
                                            <Text className="text-gray-500 font-Milliard-Medium">
                                                {doctor.specialization}
                                            </Text>
                                        </View>
                                        <View className="bg-white/50 rounded-full p-2">
                                            <Text className="text-pink-500 font-Milliard-Heavy">→</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                    )}

                    <View className="mt-6 w-full">
                        <Button
                            placeholder="Close"
                            onPress={onClose}
                            width="w-full"
                        />
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
}
