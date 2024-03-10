import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function BackHeader({ changeScreen, description, children, backgroundColor }) {

    const statusBarHeight = StatusBar.currentHeight ? 10 : 52;

    return (
        <View style={{...styles.backHeader, paddingTop: statusBarHeight, backgroundColor: backgroundColor ? backgroundColor : '#1E1D1D',}}>
            <TouchableOpacity style={styles.backBtn} onPress={changeScreen}>
                <MaterialIcons name="arrow-back-ios" size={24} color="#FFFFFF" />
                <Text style={styles.description}>
                    {description}
                </Text>
            </TouchableOpacity>
            {children ? children : ""}
        </View>
    );
}

const styles = StyleSheet.create({
    backHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 12,
        paddingBottom: 10,
    },
    description: {
        color: '#FFFFFF',
        fontFamily: 'KantumruyProSemiBold',
    },
    backBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
});
