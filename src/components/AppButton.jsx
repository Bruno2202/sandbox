import { useState } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native"

export default function AppButton({ text, onPress, backgroundColor, paddingHorizontal, paddingVertical, borderRadius, fontSize }) {

    const [btnColor, setBtnColor] = useState(backgroundColor ? backgroundColor : "#0060CE");
    const [paddingH, setPaddingH] = useState(paddingHorizontal ? paddingHorizontal : 28);
    const [paddingV, setPaddingV] = useState(paddingVertical ? paddingVertical : 8);
    const [borderR, setBorderR] = useState(borderRadius ? borderRadius : 4);
    const [fontS, setFontS] = useState(fontSize ? fontSize : 14);

    return (
        <TouchableOpacity style={{ ...styles.btn, backgroundColor: btnColor, paddingHorizontal: paddingH, paddingVertical: paddingV, borderRadius: borderR, }} onPress={onPress}>
            <Text style={{ ...styles.text, fontSize: fontS }}>
                {text}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    btn: {
        alignItems: 'center',
        borderRadius: 4,
    },
    text: {
        fontFamily: 'KantumruyProMedium',
        color: '#FFFFFF',
    },
});
