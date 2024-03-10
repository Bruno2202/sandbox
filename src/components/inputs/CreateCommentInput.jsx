import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native"
import { Ionicons } from '@expo/vector-icons';

import Input from "./Input";

export default function CreateCommentInput({ onChangeText, onPress, userPic }) {
    return (
        <View style={styles.Container}>
            <Image style={styles.userPic} source={userPic} />
            <Input onChangeText={onChangeText} placeholder={"O que você tem a dizer sobre isso?"} borderRadius={16} paddingVertical={4} multiline={true} />
            <TouchableOpacity onPress={onPress}>
                <Ionicons style={styles.sendIcon} name="send" size={24} color="#0060CE" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    Container: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginHorizontal: 52,
        marginBottom: 8,
    },
    sendIcon: {
        padding: 12,
    },
    userPic: {
        margin: 8,
        resizeMode: 'contain',
        width: 44,
        height: 44,
        borderRadius: 88,
    }
});