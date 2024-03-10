import { StyleSheet, Text } from "react-native"
import { useState } from "react";

export default function LoadingPosts({ text, fontSize }) {

    const [fontS, setFontS] = useState(fontSize ? fontSize : 12);

    return (
        <Text style={{...styles.text, fontSize: fontS}}>
            {text}
        </Text>
    );
}

const styles = StyleSheet.create({
    text: {
        marginVertical: 100,
        marginHorizontal: 12,
        color: '#FFFFFF',
        fontFamily: 'KantumruyProMedium',
        textAlign: 'center',
        opacity: 0.4,
    }
});
