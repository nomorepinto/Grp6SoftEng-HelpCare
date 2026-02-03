import { TextInput } from 'react-native';

interface TextBoxProps {
    placeholder: string;
    onChangeText: any;
    value: string;
    width?: string;
}

export default function TextBox({ placeholder, onChangeText, value, width }: TextBoxProps) {
    return (
        <TextInput className={`text-xl px-5 py-2 ${width} rounded-full font-Milliard-Medium bg-white border border-slate-500`} placeholder={placeholder} placeholderTextColor="#94a3b8" onChangeText={onChangeText} value={value} />
    );
}