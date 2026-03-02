import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PasswordTextBoxProps {
    placeholder: string;
    onChangeText: (text: string) => void;
    value: string;
    width?: string;
}

export default function PasswordTextBox({ placeholder, onChangeText, value, width }: PasswordTextBoxProps) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
        <View className={`flex-row items-center border border-slate-500 rounded-full bg-white px-5 py-2 ${width}`}>
            <TextInput
                className="flex-1 text-xl font-Milliard-Medium text-textInput"
                placeholder={placeholder}
                placeholderTextColor="#94a3b8"
                onChangeText={onChangeText}
                value={value}
                secureTextEntry={!isPasswordVisible}
            />
            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                <Ionicons
                    name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                    size={24}
                    color="#94a3b8"
                />
            </TouchableOpacity>
        </View>
    );
}
