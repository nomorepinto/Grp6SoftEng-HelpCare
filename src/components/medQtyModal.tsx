import React from 'react';
import { Modal, View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import Button from './button';
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
              <Text className="text-gray-800">Placeholder Name</Text>
            </View>

            {/* Quantity Input */}
            <Text className="text-gray-700 font-semibold mb-1">Quantity</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-4 text-base"
              placeholder="Enter quantity"
              placeholderTextColor="#999"
            />

            {/* Times Input */}
            <Text className="text-gray-700 font-semibold mb-1">Times (comma-separated)</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-4 text-base"
              placeholder="e.g., 08:00, 14:00, 20:00"
              placeholderTextColor="#999"
            />

            {/* Days Selection */}
            <Text className="text-gray-700 font-semibold mb-2">Days</Text>
            <View className="flex flex-row flex-wrap gap-2 mb-4">
              <Pressable className="px-3 py-2 rounded-lg bg-gray-200">
                <Text className="text-gray-700 font-semibold">M</Text>
              </Pressable>
              <Pressable className="px-3 py-2 rounded-lg bg-gray-200">
                <Text className="text-gray-700 font-semibold">T</Text>
              </Pressable>
              <Pressable className="px-3 py-2 rounded-lg bg-gray-200">
                <Text className="text-gray-700 font-semibold">W</Text>
              </Pressable>
              <Pressable className="px-3 py-2 rounded-lg bg-gray-200">
                <Text className="text-gray-700 font-semibold">Th</Text>
              </Pressable>
              <Pressable className="px-3 py-2 rounded-lg bg-gray-200">
                <Text className="text-gray-700 font-semibold">F</Text>
              </Pressable>
              <Pressable className="px-3 py-2 rounded-lg bg-gray-200">
                <Text className="text-gray-700 font-semibold">S</Text>
              </Pressable>
              <Pressable className="px-3 py-2 rounded-lg bg-gray-200">
                <Text className="text-gray-700 font-semibold">Su</Text>
              </Pressable>
            </View>
          </ScrollView>

          {/* Action buttons */}
          <View className="flex flex-row justify-between w-full mt-4 gap-2">
            <Button placeholder="Cancel" width="w-[45%]" onPress={onClose} />
            <Button placeholder="Confirm" width="w-[45%]" onPress={() => {}} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
