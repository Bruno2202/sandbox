import { useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Feather, AntDesign } from '@expo/vector-icons';

export default function SearchInput({ placeholder, onChangeText, paddingVertical, paddingHorizontal, flex, setTyping, typing, setText, text }) {

    const [paddingV, setPaddingV] = useState(paddingVertical ? paddingVertical : 12);
    const [paddingH, setPaddingH] = useState(paddingHorizontal ? paddingHorizontal : 8);
    const [Flex, setFlex] = useState(flex ? flex : 0);

    function resetInput() {
        setText("");
        setTyping(false);
    }

    return (
        <View style={styles.inputContent}>
            <TextInput
                value={text}
                secureTextEntry={false}
                style={{ ...styles.input, paddingVertical: paddingV, paddingHorizontal: paddingH, flex: Flex }}
                placeholder={placeholder}
                placeholderTextColor="#FFFFFF"
                onChangeText={onChangeText}
            />
            {typing ? (
                <TouchableOpacity onPress={() => resetInput()} >
                    <AntDesign style={styles.icon} name="close" size={24} color="#FFFFFF" />
                </TouchableOpacity>
            ) : (
                <Feather style={styles.icon} name="search" size={24} color="#FFFFFF" />
            )
            }
        </View>
    );
}

const styles = StyleSheet.create({
    inputContent: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        flex: 1,
        backgroundColor: '#696969',
        borderRadius: 4,
    },
    input: {
        fontFamily: 'KantumruyProMedium',
        color: '#FFFFFF',
        backgroundColor: '#696969',
        width: '100%',
        borderRadius: 4,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    icon: {
        paddingHorizontal: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#696969',
    },
});
