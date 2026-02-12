import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Pressable, ScrollView } from 'react-native';
import Button from './button';
import TextBox from './textBox';
import { medicine, day } from '../../types';
import clsx from 'clsx';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format24to12 } from '@/components/functions/timeUtils';

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
  const [times, setTimes] = useState<string[]>([]);
  const [showTimePicker, setShowTimePicker] = useState(false);
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
      setTimes(medData.times.map(t => t.time));
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

  const handleConfirmTime = (date: Date) => {
    setShowTimePicker(false);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const time24 = `${hours}:${minutes}`;
    setTimes([...times, time24]);
  };

  const removeTime = (index: number) => {
    setTimes(times.filter((_, i) => i !== index));
  };

  const handleUpdate = () => {
    if (medData && onUpdate) {
      onUpdate({
        ...medData,
        name,
        totalQuantity: parseInt(quantity) || 0,
        amountRemaining: parseInt(amountRemaining) || 0,
        times: times.map(t => ({ time: t, isTaken: false })),
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
            <Text className="text-gray-700 text-xl font-Milliard-Medium mb-4 text-center px-6">
              Editing Medicine will cause taken status to reset to false
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
            <Text className="text-gray-700 font-semibold mb-1">Times</Text>
            <View className="flex flex-row w-full justify-between mb-2">
              <Button placeholder="Add Time" onPress={() => setShowTimePicker(true)} width="w-full" />
            </View>
            <DateTimePickerModal
              isVisible={showTimePicker}
              mode="time"
              display="spinner"
              minuteInterval={30}
              onConfirm={handleConfirmTime}
              onCancel={() => setShowTimePicker(false)}
            />
            <View className="max-h-40 mb-4">
              <ScrollView className="flex-grow-0" nestedScrollEnabled={true}>
                <View className="flex flex-col gap-2 mt-2">
                  {times.length === 0 ? (
                    <View className="flex flex-row justify-center items-center border border-pink-500 rounded-3xl p-5 opacity-50">
                      <Text className="text-pink-500 text-xl font-Milliard-ExtraBold">No times added</Text>
                    </View>
                  ) : (
                    times.map((t, index) => (
                      <View key={index} className="flex flex-row justify-between items-center bg-pink-100 p-3 rounded-lg">
                        <Text className="text-pink-500 text-xl font-Milliard-Medium">{format24to12(t)}</Text>
                        <Pressable onPress={() => removeTime(index)}>
                          <Text className="text-pink-500 text-xl font-Milliard-Bold">✕</Text>
                        </Pressable>
                      </View>
                    ))
                  )}
                </View>
              </ScrollView>
            </View>

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
