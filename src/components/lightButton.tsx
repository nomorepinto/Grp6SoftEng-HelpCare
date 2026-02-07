import { Pressable, Text } from 'react-native';


interface ButtonProps {
    placeholder: string;
    onPress: any;
    width?: string;
}

export default function LightButton({ placeholder, onPress, width }: ButtonProps) {
    return (
        <Pressable
            className={`px-5 py-2 ${width} rounded-full font-Milliard-Medium bg-pink-50 border border-pink-500 active:bg-pink-300 active:scale-95 items-center justify-center text-xl`}
            onPress={onPress}
        >
            <Text className="text-pink-500 font-Milliard-Medium text-xl">{placeholder}</Text>
        </Pressable>
    );
}