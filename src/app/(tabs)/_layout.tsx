import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tabs.Screen name="index" />
        </Tabs>
    );
}

