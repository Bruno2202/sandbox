import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    back: {
        flexDirection: 'row',
        backgroundColor: '#2C2C2C',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 12,
    },
    recoverPassword: {
        flex: 1,
        backgroundColor: '#2C2C2C',
        marginTop: 100,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    pageContent: {
        position: 'absolute',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        resizeMode: 'contain',
        width: 200,
        height: 80,
        marginBottom: 32,
    },
    pageTitle: {
        textAlign: 'center',
        fontSize: 40,
        color: '#FFFFFF',
        fontFamily: 'KantumruyProSemiBold',
    },
    text: {
        color: '#FFFFFF',
        fontFamily: 'KantumruyProExtraLight',
    },
    forms: {
        gap: 12,
        margin: 28,
        width: '60%',
        alignItems: 'center',
    },
    formsInputs: {
        width: '100%',
        marginTop: 16,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
    },
});

export default styles;