import { useState } from "react";
import { Text, View, TextInput, StyleSheet, TouchableHighlight } from "react-native";

export default function PassworInput({ placeholder, onChangeText, paddingVertical, paddingHorizontal }) {

    const [showPassword, setShowPassword] = useState("🫣");
    const [paddingV, setPaddingV] = useState(paddingVertical ? paddingVertical : 8)
    const [paddingH, setPaddingH] = useState(paddingHorizontal ? paddingHorizontal : 12)

    return (
        <View style={styles.inputArea}>
            <TextInput
                secureTextEntry={showPassword === "🫣" ? true : false}
                style={{...styles.input, paddingVertical: paddingV, paddingHorizontal: paddingH}} placeholder={placeholder}
                placeholderTextColor="#FFFFFF"
                onChangeText={onChangeText}
            />
            <TouchableHighlight
                style={styles.showPassword}
                underlayColor={'#AAAAAA'}
                onPress={showPassword === "🫣" ? () => setShowPassword("🥸") : () => setShowPassword("🫣")}
            >
                <Text style={styles.emoji}>
                    {showPassword}
                </Text>
            </TouchableHighlight>
        </View>
    );
}

const styles = StyleSheet.create({
    inputArea: {
        flexDirection: 'row',
        width: '100%',
    },
    input: {
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
        fontFamily: 'KantumruyProMedium',
        color: '#FFFFFF',
        backgroundColor: '#696969',
        width: '88%',
    },
    showPassword: {
        borderBottomRightRadius: 4,
        borderTopRightRadius: 4,
        backgroundColor: '#696969',
        width: '12%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emoji: {
        width: '100%',
        margin: 0,
    }
});
