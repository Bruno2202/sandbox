import { View, StyleSheet } from "react-native"

export default function Separator() {
    return <View style={styles.separator} />
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 10
    },
    separator: {
        marginVertical: 20,
        borderBottomColor: "#3C3636",
        borderBottomWidth: StyleSheet.hairlineWidth
    }
});