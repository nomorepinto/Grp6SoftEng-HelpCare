import { View, Text } from "react-native";

interface ProgressBarProps {
    current: number;
    total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
    return (
        <View className="flex flex-row w-1/2 rounded-full bg-gray-200 border-2 border-gray-400">
            <View className={`flex flex-row rounded-full bg-green-400 500 h-5 justify-center items-center`}
                style={{ width: `${(current / total) * 100}%` }}
            >
            </View>
        </View>
    );
}