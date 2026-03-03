import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, Pressable } from 'react-native';
import { Calendar, toDateId } from '@marceloterreiro/flash-calendar';
import { pinkCalendarTheme } from './themes/pinkCalendarTheme';
import { appointment } from '../../types';
import Button from './button';
import AntDesign from '@expo/vector-icons/AntDesign';

interface CalendarModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedDate: number;
    setSelectedDate: (date: number) => void;
    appointments: appointment[];
    selectedDoctorId: string;
    showWarning: (text: string) => void;
}

export default function CalendarModal({
    isOpen,
    onClose,
    selectedDate,
    setSelectedDate,
    appointments,
    selectedDoctorId,
    showWarning
}: CalendarModalProps) {
    const [calendarMonthId, setCalendarMonthId] = useState(toDateId(new Date()));

    const handleDayPress = (dateId: string) => {
        if (new Date(dateId) < new Date()) {
            showWarning("You cannot select a past date");
            return;
        }
        if (!selectedDoctorId) {
            showWarning("Please select a doctor");
            return;
        }

        setSelectedDate(new Date(dateId).getTime());
        onClose();
    };

    const activeDateRanges = [
        {
            startId: new Date(selectedDate).toISOString().split('T')[0],
            endId: new Date(selectedDate).toISOString().split('T')[0],
        }
    ].concat(appointments?.map((appointment: appointment) => ({
        startId: new Date(appointment.date).toISOString().split('T')[0],
        endId: new Date(appointment.date).toISOString().split('T')[0]
    })) || []);

    const handleNextMonth = () => {
        const nextMonth = (dateId: string) => {
            const [year, month, day] = dateId.split("-").map(Number);
            const date = new Date(year, month, day); // month is already 1-indexed here... 
            // actually Date months are 0-indexed:
            const d = new Date(year, month - 1 + 1, day);
            return d.toISOString().split("T")[0];
        };
        setCalendarMonthId(nextMonth(calendarMonthId));
    };

    const handlePreviousMonth = () => {
        const previousMonth = (dateId: string) => {
            const [year, month, day] = dateId.split("-").map(Number);
            const date = new Date(year, month, day); // month is already 1-indexed here... 
            // actually Date months are 0-indexed:
            const d = new Date(year, month - 1 - 1, day);
            return d.toISOString().split("T")[0];
        };
        setCalendarMonthId(previousMonth(calendarMonthId));
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isOpen}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-end">
                <View className="bg-white w-full rounded-t-3xl p-6 shadow-2xl h-[70%]">
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-pink-500 text-3xl font-Milliard-ExtraBold">
                            Select Date
                        </Text>
                        <TouchableOpacity
                            onPress={onClose}
                            className="bg-pink-100 p-2 rounded-full"
                        >
                            <Text className="text-pink-500 font-Milliard-Bold px-2">Close</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="flex flex-col gap-5 border border-pink-500 rounded-3xl pb-5">
                        <View className="p-6">
                            <Calendar
                                calendarMonthId={calendarMonthId}
                                onCalendarDayPress={handleDayPress}
                                calendarActiveDateRanges={activeDateRanges}
                                theme={pinkCalendarTheme}
                            />
                        </View>

                        <View className="flex flex-row justify-center items-center gap-5">
                            <Pressable onPress={handlePreviousMonth} className="bg-gray-200 w-[40%] p-2 rounded-full items-center ">
                                <AntDesign name="caret-left" size={24} color="black" />
                            </Pressable>

                            <Pressable onPress={handleNextMonth} className="bg-gray-200 w-[40%] p-2 rounded-full items-center ">
                                <AntDesign name="caret-right" size={24} color="black" />
                            </Pressable>
                        </View>
                    </View>

                </View>
            </View>
        </Modal>
    );
}
