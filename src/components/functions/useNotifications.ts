import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export default function useNotifications() {
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState<Notifications.Notification | undefined>();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        registerForPushNotificationsAsync()
            .then(result => {
                if (result?.token) {
                    setExpoPushToken(result.token);
                } else if (result?.error) {
                    setError(result.error);
                }
            });

        const notificationListener = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            notificationListener.remove();
            responseListener.remove();
        };
    }, []);

    const scheduleNotification = useCallback(
        async (title: string, body: string, hour: number, minute: number) => {
            await Notifications.scheduleNotificationAsync({
                content: { title, body },
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.DAILY,
                    hour,
                    minute,
                },
            });
        },
        []
    );

    const scheduleAppointmentNotification = useCallback(
        async (title: string, body: string, dateParam: Date) => {
            await Notifications.scheduleNotificationAsync({
                content: { title, body },
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.DATE,
                    date: dateParam,
                },
            });
        },
        []
    );

    const cancelAllScheduledNotifications = useCallback(async () => {
        await Notifications.cancelAllScheduledNotificationsAsync();
    }, []);

    return {
        expoPushToken,
        notification,
        scheduleNotification,
        scheduleAppointmentNotification,
        cancelAllScheduledNotifications,
        error,
    };
}

async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('myNotificationChannel', {
            name: 'A channel is needed for the permissions prompt to appear',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (!Device.isDevice) {
        return { error: 'Must use physical device for Push Notifications' };
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        return { error: 'Failed to get push notification permissions' };
    }

    try {
        const projectId =
            Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

        if (!projectId) {
            throw new Error('Project ID not found');
        }

        const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
        return { token };
    } catch (e) {
        return { error: e instanceof Error ? e.message : String(e) };
    }
}