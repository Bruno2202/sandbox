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
    signUp: {
        flex: 1,
        backgroundColor: '#2C2C2C',
        justifyContent: 'center',
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
        fontSize: 52,
        color: '#FFFFFF',
        fontFamily: 'KantumruyProSemiBold',
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
    haveAccArea: {
        width: '100%',
        alignItems: 'flex-start',
    },
    haveAcc: {
        fontFamily: 'KantumruyProLight',
        color: '#0060CE',
        textDecorationLine: 'underline',
        fontSize: 16,
    },
});

export default styles;