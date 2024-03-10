import { Text, View, TouchableOpacity, Image, StyleSheet, StatusBar, Modal, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Feather } from '@expo/vector-icons';
import Toast from "react-native-toast-message";
import * as Updates from 'expo-updates';

import { onAuthStateChanged, getAuth } from "firebase/auth";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../../firebaseConfig";

import AppButton from "../AppButton";

export default function FeedHeader({ forceUpdate, haveUpdate, setHaveUpdate, fetchPosts }) {

    const [userPic, setUserPic] = useState(null);
    const [uid, setUid] = useState(null)
    const [updateAppModalVisible, setUpdateAppModalVisible] = useState(false);

    const statusBarHeight = StatusBar.currentHeight ? 10 : 50;

    useEffect(() => {
        onAuthStateChanged(getAuth(), (user) => {
            if (user) {
                const uid = user.uid;
                setUid(uid);
                const storageRef = ref(storage, `${uid}/UserPic`);
                getDownloadURL(storageRef)
                    .then((url) => {
                        setUserPic({ uri: url })
                    })
                    .catch((error) => {
                        setUserPic(require('../../assets/img/userPic.png'))
                    });
            }
        });
    }, [forceUpdate]);

    async function updateApp() {
        setUpdateAppModalVisible(!updateAppModalVisible);
        setHaveUpdate(false);
        Toast.show({
            type: 'info',
            text1: 'Atualização em andamento! ⏳',
            text2: 'Aguarde um momentinho, por gentileza'
        });
        try {
            await Updates.fetchUpdateAsync();
            Toast.show({
                type: 'success',
                text1: 'Atualização realizada com sucesso! ✅',
                text2: 'Reabra o aplicativo para aplicar as alterações'
            });
        } catch (error) {
            setHaveUpdate(true);
            Toast.show({
                type: 'error',
                text1: 'Erro ao tentar atualizar aplicativo ❌',
                text2: 'Tente novamente mais tarde'
            });
        }
    }

    const navigation = useNavigation();
    function handleProfileScreen() {
        navigation.navigate("Profile", {
            userPic: userPic,
            uid: uid
        });
    }

    return (
        <>
            <Modal
                animationType="none"
                transparent={true}
                visible={updateAppModalVisible}
                onRequestClose={() => {
                    setUpdateAppModalVisible(!updateAppModalVisible);
                }}>
                <Pressable style={styles.updateAppContainer} onPress={() => setUpdateAppModalVisible(!updateAppModalVisible)}>
                    <View style={styles.updateAppModal}>
                        <Text style={styles.titleModal}>
                            Nova atualização disponível!
                        </Text>
                        <Text style={styles.textModal}>
                            Uma nova atualização do aplicativo está disponível. Deseja atualizar agora?
                        </Text>
                        <View style={styles.buttonModal} >
                            <AppButton
                                onPress={() => setUpdateAppModalVisible(!updateAppModalVisible)}
                                text={"Cancelar"}
                                backgroundColor={"#A01212"}
                                fontSize={12}
                                paddingHorizontal={8}
                            />
                            <AppButton
                                onPress={() => updateApp()}
                                text={"Atualizar"}
                                fontSize={12}
                                paddingHorizontal={8} />
                        </View>
                    </View>
                </Pressable>
            </Modal>

            <View style={{ ...styles.header, paddingTop: statusBarHeight }}>
                {haveUpdate ? (
                    <TouchableOpacity onPress={() => setUpdateAppModalVisible(!updateAppModalVisible)}>
                        <Image style={{ ...styles.logo, width: 46, marginLeft: 0.0000001 }} source={require('../../assets/img/miniUpdateLogo.png')} />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={fetchPosts}>
                        <Image style={styles.logo} source={require('../../assets/img/miniLogo.png')} />
                    </TouchableOpacity>
                )}
                <Text style={styles.title}>
                    FEED
                </Text>
                <TouchableOpacity activeOpacity={0.5} onPress={handleProfileScreen}>
                    <Image style={styles.userPic} source={userPic} />
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        backgroundColor: '#1E1D1D',
        width: '100%',
        paddingHorizontal: 4,
        paddingBottom: 10,
    },
    logo: {
        marginLeft: 4,
        resizeMode: 'contain',
        height: 40,
        width: 40
    },
    newUpdate: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
    },
    userPic: {
        marginRight: 4,
        resizeMode: 'contain',
        height: 40,
        width: 40,
        borderRadius: 50,
    },
    title: {
        margin: 0,
        padding: 0,
        fontSize: 16,
        textAlign: 'center',
        color: '#FFFFFF',
        fontFamily: 'KantumruyProSemiBold',
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