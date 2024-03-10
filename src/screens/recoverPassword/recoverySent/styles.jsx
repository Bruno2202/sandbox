import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    recoverySent: {
        flex: 1,
        backgroundColor: '#2C2C2C',
        alignContent: 'center',
        justifyContent: 'center',
    },
    pageContent: {
        position: 'absolute',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pageTitle: {
        textAlign: 'center',
        lineHeight: 40,
        fontSize: 40,
        color: '#FFFFFF',
        fontFamily: 'KantumruyProSemiBold',
    },
    text: {
        color: '#FFFFFF',
        fontFamily: 'KantumruyProRegular',
        margin: 38,
        fontSize: 20,
        textAlign: 'center',
    },
    loginBtn: {
        marginTop: 40,
    },
    logo: {
        // resizeMode: 'contain',
        position: 'absolute',
        width: '125%',
        height: 220,
        left: -50,
        bottom: -120,
    },
});

export default styles