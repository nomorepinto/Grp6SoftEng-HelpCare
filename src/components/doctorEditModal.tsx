import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Pressable, ScrollView } from 'react-native';
import Button from './button';
import TextBox from './textBox';
import { doctor, day } from '../../types';
import clsx from 'clsx';

interface DoctorEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    doctor?: doctor;
    onUpdate?: (updatedDoctor: doctor) => void;
}

export default function DoctorEditModal({
    isOpen,
    onClose,
    doctor: doctorData,
    onUpdate,
}: DoctorEditModalProps) {
    const [name, setName] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [secretary, setSecretary] = useState('');
    const [daysAvailable, setDaysAvailable] = useState<day[]>([]);
    const [color, setColor] = useState('');

    const colors = [
        'bg-red-100', 'bg-amber-100', 'bg-lime-100', 'bg-emerald-100',
        'bg-cyan-100', 'bg-blue-100', 'bg-violet-100', 'bg-fuchsia-100'
    ];

    useEffect(() => {
        if (doctorData) {
            setName(doctorData.name);
            setSpecialization(doctorData.specialization);
            setSecretary(doctorData.secretary);
            setDaysAvailable(doctorData.daysAvailable);
            setColor(doctorData.color);
        }
    }, [doctorData, isOpen]);

    const toggleDay = (targetDay: day) => {
        setDaysAvailable(prev =>
            prev.includes(targetDay)
                ? prev.filter(d => d !== targetDay)
                : [...prev, targetDay]
        );
    };

    const handleUpdate = () => {
        if (doctorData && onUpdate) {
            onUpdate({
                ...doctorData,
                name,
                specialization,
                secretary,
                daysAvailable,
                color,
            });
        }
        onClose();
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isOpen}
        >
            <View className="flex-1 justify-center items-center px-6">
                <View className="bg-white w-full rounded-3xl p-6 items-center shadow-lg max-h-[80%]">
                    <ScrollView className="w-full" showsVerticalScrollIndicator={false}>
                        <Text className="text-pink-500 text-3xl font-Milliard-ExtraBold mb-6 text-center">
                            Edit Doctor
                        </Text>

                        <View className="w-full gap-4">
                            <View>
                                <Text className="text-gray-700 font-semibold mb-1">Doctor's Name</Text>
                                <TextBox
                                    width="w-full"
                                    placeholder="Enter name"
                                    onChangeText={setName}
                                    value={name}
                                />
                            </View>

                            <View>
                                <Text className="text-gray-700 font-semibold mb-1">Specialty</Text>
                                <TextBox
                                    width="w-full"
                                    placeholder="Enter specialty"
                                    onChangeText={setSpecialization}
                                    value={specialization}
                                />
                            </View>

                            <View>
                                <Text className="text-gray-700 font-semibold mb-1">Secretary</Text>
                                <TextBox
                                    width="w-full"
                                    placeholder="Enter secretary"
                                    onChangeText={setSecretary}
                                    value={secretary}
                                />
                            </View>

                            <View>
                                <Text className="text-gray-700 font-semibold mb-2">Days Available</Text>
                                <View className="flex flex-row flex-wrap justify-between">
                                    {(['M', 'T', 'W', 'Th', 'F', 'S', 'Su'] as day[]).map((day) => (
                                        <Pressable
                                            key={day}
                                            onPress={() => toggleDay(day)}
                                            className={`px-3 py-2 rounded-lg mb-2 ${daysAvailable.includes(day) ? 'bg-pink-500' : 'bg-gray-200'}`}
                                        >
                                            <Text className={`${daysAvailable.includes(day) ? 'text-white' : 'text-gray-700'} font-semibold`}>{day}</Text>
                                        </Pressable>
                                    ))}
                                </View>
                            </View>

                            <View>
                                <Text className="text-gray-700 font-semibold mb-2">Color Tag</Text>
                                <View className="flex flex-row flex-wrap justify-between mb-4">
                                    {colors.map((c) => (
                                        <Pressable
                                            key={c}
                                            onPress={() => setColor(c)}
                                            className={clsx(
                                                "w-10 h-10 rounded-full border-2 mb-2",
                                                c,
                                                color === c ? "border-pink-500" : "border-transparent"
                                            )}
                                        />
                                    ))}
                                </View>
                            </View>
                        </View>
                    </ScrollView>

                    <View className="flex flex-row justify-between w-full mt-6 gap-2">
                        <Button placeholder="Cancel" width="w-[48%]" onPress={onClose} />
                        <Button placeholder="Confirm" width="w-[48%]" onPress={handleUpdate} />
                    </View>
                </View>
            </View>
        </Modal>
    );
}
