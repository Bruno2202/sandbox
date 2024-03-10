import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    createComment: {
        flex: 1,
        padding: 20,
        backgroundColor: '#2C2C2C',
    },
    miniLogo: {
        alignItems: 'center',
        justifyContent: 'center',
        resizeMode: 'contain',
        height: 20,
        position: 'absolute',
        left: '50%',
        marginLeft: -18,
        right: '50%',
        zIndex: 1,
    },
    sendCommnet: {
        padding: 8,
    },
});

export default styles;