import React, { useState } from 'react';
import { Modal, View, Text, ScrollView } from 'react-native';
import Button from './button';
import { medicine } from '../../types';

interface MedInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicine?: medicine;
}

export default function MedInfoModal({
  isOpen,
  onClose,
  medicine: medData,
}: MedInfoModalProps) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpen}
    >
      <View className="flex-1 justify-center items-center px-6">
        {/* Modal content container */}
        <View className="bg-white w-full rounded-3xl p-6 items-center shadow-lg max-h-[80%]">
          {/* Title */}
          <Text className="text-pink-500 text-3xl font-Milliard-ExtraBold mb-4 text-center">
            Medicine Information
          </Text>

          {/* Scrollable content area */}
          <ScrollView className="w-full mb-6">
            {/* Medicine name */}
            <View className="mb-4">
              <Text className="text-slate-700 text-lg font-Milliard-Bold mb-2">
                Name
              </Text>
              <View className="border border-slate-300 rounded-xl px-4 py-3 bg-slate-50">
                <Text className="text-slate-600 text-base font-Milliard-Medium">
                  {medData?.name || 'Medicine Name'}
                </Text>
              </View>
            </View>

            {/* Quantity */}
            <View className="mb-4">
              <Text className="text-slate-700 text-lg font-Milliard-Bold mb-2">
                Quantity
              </Text>
              <View className="border border-slate-300 rounded-xl px-4 py-3 bg-slate-50">
                <Text className="text-slate-600 text-base font-Milliard-Medium">
                  {medData?.quantity || 'N/A'}
                </Text>
              </View>
            </View>

            {/* Times */}
            <View className="mb-4">
              <Text className="text-slate-700 text-lg font-Milliard-Bold mb-2">
                Times
              </Text>
              <View className="border border-slate-300 rounded-xl px-4 py-3 bg-slate-50">
                <Text className="text-slate-600 text-base font-Milliard-Medium">
                  {medData?.times?.join(', ') || 'N/A'}
                </Text>
              </View>
            </View>

            {/* Days */}
            <View className="mb-4">
              <Text className="text-slate-700 text-lg font-Milliard-Bold mb-2">
                Days
              </Text>
              <View className="border border-slate-300 rounded-xl px-4 py-3 bg-slate-50">
                <Text className="text-slate-600 text-base font-Milliard-Medium">
                  {medData?.days?.join(', ') || 'N/A'}
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Action button */}
          <View className="w-full">
            <Button placeholder="Close" width="w-full" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
