import { View, TouchableOpacity, StyleSheet, Platform } from "react-native"
import React, { useRef } from "react";
import { Octicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

export default function FeedFooter({ myUid, onPress }) {

    const footerPaddingBottom = Platform.OS === 'ios' ? 40 : 12;

    const navigation = useNavigation();
    function handleCreatePostScreen() {
        navigation.navigate("CreatePost", {
            myUid: myUid
        });
    }
    function handleSearchProfileScreen() {
        navigation.navigate("SearchProfile", {});
    }

    return (
        <View style={{ ...styles.footer, paddingBottom: footerPaddingBottom }}>
            <TouchableOpacity onPress={onPress}>
                <Octicons name="home" size={28} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCreatePostScreen}>
                <Octicons name="diff-added" size={28} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSearchProfileScreen}>
                <Octicons name="search" size={28} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    footer: {
        flexDirection: 'row',
        paddingTop: 10,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#1E1D1D',
    },
});