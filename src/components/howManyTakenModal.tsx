import { useState } from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import Button from './button';
import TextBox from './textBox';
import { groupedMedsByHours, medicine } from 'types';

interface WarningModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedHour?: groupedMedsByHours;
    selectedMedicineID?: string;
    takeMedicine: any;
}

export default function HowManyTakenModal({ isOpen, onClose, selectedHour, selectedMedicineID, takeMedicine }: WarningModalProps) {

    const [howManyTaken, setHowManyTaken] = useState('');

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
                        How many did you take?
                    </Text>

                    <TextBox
                        placeholder="0"
                        value={howManyTaken}
                        onChangeText={setHowManyTaken}
                        width="w-1/2"
                        isNumeric={true}
                    />

                    <Button
                        placeholder="Close"
                        onPress={() => { howManyTaken === '' ? null : takeMedicine(selectedHour?.medicines.find((med: medicine) => med.id === selectedMedicineID) ?? null, selectedHour?.hour ?? null, Number(howManyTaken)); onClose(); setHowManyTaken(''); }}
                        width="w-1/2"
                    />
                </View>
            </View>
        </Modal>
    );
}
