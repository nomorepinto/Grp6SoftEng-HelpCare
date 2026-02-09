import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Pressable, ScrollView } from 'react-native';
import Button from './button';
import TextBox from './textBox';
import { medicine, day } from '../../types';
import clsx from 'clsx';

interface MedEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicine?: medicine;
  onUpdate?: (updatedMedicine: medicine) => void;
}

export default function MedEditModal({
  isOpen,
  onClose,
  medicine: medData,
  onUpdate,
}: MedEditModalProps) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [amountRemaining, setAmountRemaining] = useState('');
  const [times, setTimes] = useState('');
  const [days, setDays] = useState<day[]>([]);
  const [color, setColor] = useState('');

  const colors = [
    'bg-red-200', 'bg-blue-200', 'bg-green-200', 'bg-yellow-200',
    'bg-purple-200', 'bg-pink-200', 'bg-orange-200', 'bg-slate-200'
  ];

  useEffect(() => {
    if (medData) {
      setName(medData.name);
      setQuantity(medData.totalQuantity.toString());
      setAmountRemaining(medData.amountRemaining.toString());
      setTimes(medData.times.map(t => t.time).join(', '));
      setDays(medData.days);
      setColor(medData.color);
    }
  }, [medData, isOpen]);

  const toggleDay = (targetDay: day) => {
    setDays(prev =>
      prev.includes(targetDay)
        ? prev.filter(d => d !== targetDay)
        : [...prev, targetDay]
    );
  };

  const handleUpdate = () => {
    if (medData && onUpdate) {
      onUpdate({
        ...medData,
        name,
        totalQuantity: parseInt(quantity) || 0,
        amountRemaining: parseInt(amountRemaining) || 0,
        times: times.split(',').map(t => t.trim()).filter(t => t !== '').map(t => ({ time: t, isTaken: false })),
        days,
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
        {/* Modal content container */}
        <View className="bg-white w-full rounded-3xl p-6 items-center shadow-lg max-h-[80%]">
          <ScrollView className="w-full" showsVerticalScrollIndicator={false}>
            {/* Title */}
            <Text className="text-pink-500 text-3xl font-Milliard-ExtraBold mb-4 text-center">
              Edit Medicine
            </Text>

            {/* Medicine Name */}
            <Text className="text-gray-700 font-semibold mb-1">Name</Text>
            <TextBox
              width="w-full"
              placeholder="Enter name"
              onChangeText={setName}
              value={name}
            />
            <View className="mb-4" />

            <View className="flex flex-row justify-between w-full">
              <View className="w-full">
                <Text className="text-gray-700 font-semibold mb-1">Quantity</Text>
                <TextBox
                  width="w-full"
                  placeholder="Quantity"
                  onChangeText={setQuantity}
                  value={quantity}
                  isNumeric
                />
              </View>
            </View>
            <View className="mb-4" />

            <View className="w-full">
              <Text className="text-gray-700 font-semibold mb-1">Amount Remaining</Text>
              <TextBox
                width="w-full"
                placeholder="Remaining"
                onChangeText={setAmountRemaining}
                value={amountRemaining}
                isNumeric
              />
            </View>
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
            <View className="flex flex-row flex-wrap justify-between mb-4">
              {(['M', 'T', 'W', 'Th', 'F', 'S', 'Su'] as day[]).map((day) => (
                <Pressable
                  key={day}
                  onPress={() => toggleDay(day)}
                  className={`px-3 py-2 rounded-lg ${days.includes(day) ? 'bg-pink-500' : 'bg-gray-200'}`}
                >
                  <Text className={`${days.includes(day) ? 'text-white' : 'text-gray-700'} font-semibold`}>{day}</Text>
                </Pressable>
              ))}
            </View>

            {/* Color Selection */}
            <Text className="text-gray-700 font-semibold mb-2">Color Tag</Text>
            <View className="flex flex-row flex-wrap justify-between mb-4">
              {colors.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => setColor(c)}
                  className={clsx(
                    "w-10 h-10 rounded-full border-2",
                    c,
                    color === c ? "border-pink-500" : "border-transparent"
                  )}
                />
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
