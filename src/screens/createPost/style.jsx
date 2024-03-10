import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    miniLogo: {
        alignItems: 'center', 
        justifyContent: 'center',
        resizeMode: 'contain',
        height: 20,
        left: '50%',
        marginLeft: +10,
        right: '50%',
        zIndex: 1,
    },
    createPost: {
        backgroundColor: '#2C2C2C',
        flex:1,
    }
});

export default styles;