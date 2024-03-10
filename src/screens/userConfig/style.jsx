import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    config: {
        position: 'relative',
        height: '100%',
        backgroundColor: '#2C2C2C',
        alignItems: 'center',
    },
    bannerContainer: {
        position: 'relative',
    },
    banner: {
        width: '100%',
        aspectRatio: 16 / 7.03,
        resizeMode: 'contain',
    },
    centeredUserPicContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -60 }, { translateY: -60 }],
    },
    userPic: {
        borderWidth: 4,
        borderColor: '#2C2C2C',
        zIndex: 1,
        resizeMode: 'contain',
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    textContent: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 12,
    },
    label: {
        opacity: 0.5,
        color: '#FFFFFF',
        fontSize: 20,
        marginBottom: 4,
        fontFamily: 'KantumruyProSemiBold',
    },
    username: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'KantumruyProMedium',
        fontSize: 16,
        textDecorationLine: 'underline'
    },
    newBio: {
        flexDirection: 'row',
    },
    bioLabel: {
        fontFamily: 'KantumruyProMediumItalic',
        color: '#FFFFFF',
        fontSize: 16,
    },
    bio: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'KantumruyProMediumItalic',
        textDecorationLine: 'underline',
    },
    btnSection: {
        alignItems: 'center',
        width: '50%',
        gap: 40,
        marginTop: 40,
    },
    email: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'KantumruyProMedium',
        textDecorationLine: 'underline',
    },
    updateAppContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    updateAppModal: {
        width: '90%',
        backgroundColor: '#0E0E0E',
        padding: 12,
        borderRadius: 4,
    },
    titleModal: {
        marginBottom: 4,
        color: '#FFFFFF',
        fontFamily: 'KantumruyProSemiBold',
        fontSize: 18,
    },
    textModal: {
        marginVertical: 8,
        color: '#FFFFFF',
        fontFamily: 'KantumruyProMedium',
        fontSize: 14,
    },
    buttonModal: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    }
});

export default styles;