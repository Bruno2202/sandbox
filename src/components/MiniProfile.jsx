import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet, Image } from "react-native";

export default function MiniProfile({ userPic, username, uid }) {

    const navigation = useNavigation();
    function handleProfileScreen() {
        navigation.navigate("Profile", { uid })
    }

    return (
        <TouchableOpacity style={styles.miniProfile} onPress={() => handleProfileScreen()}>
            <Image style={styles.userPic} source={userPic} />
            <Text style={styles.username}>
                {username}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    miniProfile: {
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 4,
        backgroundColor: '#3D3D3D',
        width: '90%',
        paddingHorizontal: 4,
        paddingVertical: 4,
        margin: 12,
    },
    userPic: {
        resizeMode: 'contain',
        width: 50,
        height: 50,
        borderRadius: 50,
    },
    username: {
        fontFamily: 'KantumruyProSemiBold',
        fontSize: 16,
        color: '#FFFFFF',
        marginHorizontal: 12,
    }
});