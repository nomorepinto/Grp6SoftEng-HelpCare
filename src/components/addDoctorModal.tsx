import { useState } from 'react';
import { Modal, View, Text } from 'react-native';
import Button from './button';
import TextBox from './textBox';

interface AddDoctorModalProps {
    isOpen: boolean;
    onClose: () => void;
    addDoctor: (name: string, specialty: string) => void;
}

export default function AddDoctorModal({ isOpen, onClose, addDoctor }: AddDoctorModalProps) {

    const [doctorName, setDoctorName] = useState('');
    const [specialty, setSpecialty] = useState('');

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
                        Add Doctor
                    </Text>

                    <View className="w-full gap-4">
                        <TextBox
                            placeholder="Doctor Name"
                            value={doctorName}
                            onChangeText={setDoctorName}
                            width="w-full"
                        />
                        <TextBox
                            placeholder="Specialty"
                            value={specialty}
                            onChangeText={setSpecialty}
                            width="w-full"
                        />
                    </View>

                    <View className="flex flex-row w-full justify-center gap-2 mt-4">
                        <Button
                            placeholder="Cancel"
                            onPress={() => { onClose(); setDoctorName(''); setSpecialty(''); }}
                            width="w-1/2"
                        />
                        <Button
                            placeholder="Confirm"
                            onPress={() => {
                                (doctorName === '' || specialty === '') ? null :
                                    addDoctor(doctorName, specialty);
                                onClose();
                                setDoctorName('');
                                setSpecialty('');
                            }}
                            width="w-1/2"
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}
