import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    profile: {
        flex: 1,
        backgroundColor: '#2C2C2C',
        width: '100%',
        height: '100%',
    },
    header: {
        flexDirection: 'row',
    },
    userBanner: {
        width: '100%',
        aspectRatio: 16/7.03,
        resizeMode: 'contain',
    },
    picture: {
        height: 0,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: '20%',
        backgroundColor: '#2C2C2C',
    },
    userPic: {
        borderWidth: 4,
        borderColor: '#2C2C2C',
        zIndex: 1,
        resizeMode: 'contain',
        width: 150,
        height: 150,
        borderRadius: 150,
    },
    username: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontFamily: 'KantumruyProMedium',
        fontSize: 30,
    },
    bio: {
        color: '#FFFFFF',
        fontFamily: 'KantumruyProMediumItalic',
        textAlign: 'center',
        fontSize: 12,
        opacity: 0.5,
    },
    posts: {
        marginVertical: 40,
        marginHorizontal: 20,
    },
    text: {
        color: '#FFFFFF',
        fontFamily: 'KantumruyProMedium'
    }, 
});

export default styles;