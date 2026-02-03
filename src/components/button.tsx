import { Pressable, Text } from 'react-native';


interface ButtonProps {
    placeholder: string;
    onPress: any;
    width?: string;
}

export default function Button({ placeholder, onPress, width }: ButtonProps) {
    return (
        <Pressable
            className={`px-5 py-2 ${width} rounded-full font-Milliard-Medium bg-pink-500 active:bg-pink-600 active:scale-95 text-white items-center justify-center text-xl`}
            onPress={onPress}
        >
            <Text className="text-white font-Milliard-Medium text-xl">{placeholder}</Text>
        </Pressable>
    );
}