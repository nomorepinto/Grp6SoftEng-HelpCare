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
    const [isRegistered, setIsRegistered] = useState(false);
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        registerForPushNotificationsAsync()
            .then(result => {
                setHasPermission(result?.status === 'granted');
                if (result?.token) {
                    setExpoPushToken(result.token);
                    setIsRegistered(true);
                } else if (result?.error) {
                    setError(result.error);
                    setIsRegistered(false);
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
        async (title: string, body: string, hour: number, minute: number, weekday: number) => {
            await Notifications.scheduleNotificationAsync({
                content: { title, body },
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
                    hour,
                    minute,
                    weekday,
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

    const scheduleInventoryNotification = useCallback(
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

    const cancelAllScheduledNotifications = useCallback(async () => {
        await Notifications.cancelAllScheduledNotificationsAsync();
    }, []);

    return {
        expoPushToken,
        notification,
        scheduleNotification,
        scheduleAppointmentNotification,
        cancelAllScheduledNotifications,
        scheduleInventoryNotification,
        error,
        isRegistered,
        hasPermission
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

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        return { status: finalStatus, error: 'Failed to get push notification permissions' };
    }

    if (!Device.isDevice) {
        return { status: finalStatus, error: 'Must use physical device for Push Notifications' };
    }

    try {
        const projectId =
            Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

        if (!projectId) {
            throw new Error('Project ID not found');
        }

        const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
        return { status: finalStatus, token };
    } catch (e) {
        return { status: finalStatus, error: e instanceof Error ? e.message : String(e) };
    }
}