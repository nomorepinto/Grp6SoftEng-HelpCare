import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import TextBox from '@/components/textBox';
import PasswordTextBox from '@/components/passwordTextBox';
import Button from '@/components/button';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

export default function Login() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const opacity = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(opacity.value, { duration: 50 })
        };
    });

    const handleLogin = () => {
        // Placeholder for login logic
        console.log('Login with:', username, password);
        router.replace('/(tabs)');
    };

    return (
        <Animated.View className="flex-1" style={animatedStyle}>
            <View className="px-6 pt-16 pb-5 bg-white items-center justify-center">
                <Text className="text-3xl font-Milliard-ExtraBold text-pink-500">
                    Login
                </Text>
            </View>

            <View className="flex-1 bg-gray-150 justify-between">
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-8 justify-center">
                    <View className="mb-10 items-center">
                        <Text className="text-5xl font-Milliard-ExtraBold text-pink-500">HelpCare</Text>
                        <Text className="text-lg font-Milliard-Medium text-gray-400 mt-2">Welcome back!</Text>
                    </View>

                    <View className="gap-4">
                        <View>
                            <Text className="text-gray-700 font-Milliard-Heavy text-lg mb-2 ml-2">Username</Text>
                            <TextBox
                                placeholder="Enter your username"
                                value={username}
                                onChangeText={setUsername}
                                width="w-full"
                            />
                        </View>

                        <View>
                            <Text className="text-gray-700 font-Milliard-Heavy text-lg mb-2 ml-2">Password</Text>
                            <PasswordTextBox
                                placeholder="Enter your password"
                                value={password}
                                onChangeText={setPassword}
                                width="w-full"
                            />
                        </View>

                        <TouchableOpacity className="items-end mt-1">
                            <Text className="text-pink-500 font-Milliard-Medium">Forgot Password?</Text>
                        </TouchableOpacity>

                        <View className="mt-6 gap-3 pb-10">
                            <Button
                                placeholder="Login"
                                onPress={handleLogin}
                                width="w-full"
                            />
                            <View className="flex-row items-center justify-center mt-4">
                                <Text className="text-gray-400 font-Milliard-Medium">Don't have an account? </Text>
                                <TouchableOpacity onPress={() => router.push('/signup')}>
                                    <Text className="text-pink-500 font-Milliard-Heavy">Sign Up</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </Animated.View>
    );
}
