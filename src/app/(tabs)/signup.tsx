import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import TextBox from '@/components/textBox';
import PasswordTextBox from '@/components/passwordTextBox';
import Button from '@/components/button';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';

export default function SignUp() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const opacity = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(opacity.value, { duration: 50 })
        };
    });

    const handleSignUp = () => {
        // Placeholder for sign up logic
        console.log('Sign up with:', username, email, password);
        router.replace('/(tabs)');
    };

    return (
        <Animated.View className="flex-1" style={animatedStyle}>
            <View className="px-6 pt-16 pb-5 bg-white items-center justify-center">
                <Text className="text-3xl font-Milliard-ExtraBold text-pink-500">
                    Sign Up
                </Text>
            </View>

            <View className="flex-1 bg-gray-150 justify-between">
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-8 py-10">
                    <TouchableOpacity onPress={() => router.back()} className="mb-6">
                        <Text className="text-pink-500 font-Milliard-Medium">← Back</Text>
                    </TouchableOpacity>

                    <View className="mb-10">
                        <Text className="text-4xl font-Milliard-ExtraBold text-pink-500">Create Account</Text>
                        <Text className="text-lg font-Milliard-Medium text-gray-400 mt-2">Start your health journey</Text>
                    </View>

                    <View className="gap-4">
                        <View>
                            <Text className="text-gray-700 font-Milliard-Heavy text-lg mb-2 ml-2">Username</Text>
                            <TextBox
                                placeholder="Choose a username"
                                value={username}
                                onChangeText={setUsername}
                                width="w-full"
                            />
                        </View>

                        <View>
                            <Text className="text-gray-700 font-Milliard-Heavy text-lg mb-2 ml-2">Email</Text>
                            <TextBox
                                placeholder="Enter your email"
                                value={email}
                                onChangeText={setEmail}
                                width="w-full"
                            />
                        </View>

                        <View>
                            <Text className="text-gray-700 font-Milliard-Heavy text-lg mb-2 ml-2">Password</Text>
                            <PasswordTextBox
                                placeholder="Create a password"
                                value={password}
                                onChangeText={setPassword}
                                width="w-full"
                            />
                        </View>

                        <View>
                            <Text className="text-gray-700 font-Milliard-Heavy text-lg mb-2 ml-2">Confirm Password</Text>
                            <PasswordTextBox
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                width="w-full"
                            />
                        </View>

                        <View className="mt-8 gap-3">
                            <Button
                                placeholder="Sign Up"
                                onPress={handleSignUp}
                                width="w-full"
                            />
                            <View className="flex-row items-center justify-center mt-4 pb-10">
                                <Text className="text-gray-400 font-Milliard-Medium">Already have an account? </Text>
                                <TouchableOpacity onPress={() => router.push('/login')}>
                                    <Text className="text-pink-500 font-Milliard-Heavy">Login</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </Animated.View>
    );
}
