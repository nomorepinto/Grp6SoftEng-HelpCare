import { Pressable, Text } from 'react-native';


interface ButtonProps {
    placeholder: string;
    onPress: any;
    width?: string;
}

export default function LightButton({ placeholder, onPress, width }: ButtonProps) {
    return (
        <Pressable
            className={`px-5 py-2 ${width} rounded-full font-Milliard-Medium bg-white border border-gray-200 active:scale-95 items-center justify-center text-xl`}
            onPress={onPress}
        >
            <Text className="text-gray-700 font-Milliard-ExtraBold text-xl">{placeholder}</Text>
        </Pressable>
    );
}