import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import TextBox from '@/components/textBox';

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center bg-black">
      <Text className="text-white text-2xl font-Milliard-ExtraBold">Home</Text>
      <TextBox width="w-full" placeholder="Name" onChangeText={() => { }} value="" />
    </View>
  );
}
