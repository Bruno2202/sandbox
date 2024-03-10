import { View, Text, StyleSheet } from "react-native"

export default function FeedPostsFooter() {
    
    return (
        <View style={styles.footer}>
            <Text style={styles.text}>
                © Bruno C. Terribile 2024
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    footer: {
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.5,
    },
    text: {
        color: '#FFFFFF',
        fontSize: 12,
        fontFamily: 'KantumruyProRegular',
    },
});