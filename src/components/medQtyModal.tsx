import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Pressable, ScrollView } from 'react-native';
import Button from './button';
import TextBox from './textBox';
import { medicine } from '../../types';

interface MedQtyModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicine?: medicine;
  onUpdate?: (updatedMedicine: medicine) => void;
}

export default function MedQtyModal({
  isOpen,
  onClose,
  medicine: medData,
  onUpdate,
}: MedQtyModalProps) {
  const [quantity, setQuantity] = useState('');
  const [times, setTimes] = useState('');

  useEffect(() => {
    if (medData) {
      setQuantity(medData.quantity.toString());
      setTimes(medData.times.join(', '));
    }
  }, [medData, isOpen]);

  const handleUpdate = () => {
    if (medData && onUpdate) {
      onUpdate({
        ...medData,
        quantity: parseInt(quantity) || 0,
        times: times.split(',').map(t => t.trim()).filter(t => t !== ''),
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
        {/* Modal content container */}
        <View className="bg-white w-full rounded-3xl p-6 items-center shadow-lg max-h-[80%]">
          <ScrollView className="w-full" showsVerticalScrollIndicator={false}>
            {/* Title */}
            <Text className="text-pink-500 text-3xl font-Milliard-ExtraBold mb-4 text-center">
              Edit Medicine
            </Text>

            {/* Medicine Name (read-only) */}
            <Text className="text-gray-700 font-semibold mb-1">Name</Text>
            <View className="bg-gray-100 rounded-lg p-3 mb-4">
              <Text className="text-gray-800">{medData?.name || 'Medicine Name'}</Text>
            </View>

            {/* Quantity Input */}
            <Text className="text-gray-700 font-semibold mb-1">Quantity</Text>
            <TextBox
              width="w-full"
              placeholder="Enter quantity"
              onChangeText={setQuantity}
              value={quantity}
              isNumeric
            />
            <View className="mb-4" />

            {/* Times Input */}
            <Text className="text-gray-700 font-semibold mb-1">Times (comma-separated)</Text>
            <TextBox
              width="w-full"
              placeholder="e.g., 08:00, 14:00, 20:00"
              onChangeText={setTimes}
              value={times}
            />
            <View className="mb-4" />

            {/* Days Selection */}
            <Text className="text-gray-700 font-semibold mb-2">Days</Text>
            <View className="flex flex-row flex-wrap gap-2 mb-4">
              {['M', 'T', 'W', 'Th', 'F', 'S', 'Su'].map((day) => (
                <Pressable
                  key={day}
                  className={`px-3 py-2 rounded-lg ${medData?.days.includes(day as any) ? 'bg-pink-500' : 'bg-gray-200'}`}
                >
                  <Text className={`${medData?.days.includes(day as any) ? 'text-white' : 'text-gray-700'} font-semibold`}>{day}</Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          {/* Action buttons */}
          <View className="flex flex-row justify-between w-full mt-4 gap-2">
            <Button placeholder="Cancel" width="w-[45%]" onPress={onClose} />
            <Button placeholder="Confirm" width="w-[45%]" onPress={handleUpdate} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
