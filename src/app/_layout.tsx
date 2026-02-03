import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'global.css';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();


export default function RootLayout() {
    const [loaded, error] = useFonts({
        'Milliard-ExtraBold': require('../assets/fonts/Rene Bieder  Milliard ExtraBold.otf'),
        'Milliard-Heavy': require('../assets/fonts/Rene Bieder  Milliard Heavy.otf'),
        'Milliard-Medium': require('../assets/fonts/Rene Bieder  Milliard Medium.otf'),
        'Milliard-Thin': require('../assets/fonts/Rene Bieder  Milliard Thin.otf'),
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }


    return (
        <>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="auto" />
        </>
    );
}
