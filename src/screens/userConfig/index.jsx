import { View, Text, TouchableOpacity, Image, TextInput, Modal, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import * as Updates from 'expo-updates';
import * as ImagePicker from 'expo-image-picker';

import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { deleteUser } from "firebase/auth";
import { collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db, storage } from "../../../firebaseConfig";

import styles from "./style";
import BackHeader from "../../components/BackHeader"
import LogOut from "../../components/LogOut";
import AppButton from "../../components/AppButton";

export default function UserConfig({ route }) {

    const [newUsername, setNewUsername] = useState();
    const [newDescription, setNewDescription] = useState();
    const [currentVersion, setCurrentVersion] = useState('');
    const [updateAppModalVisible, setUpdateAppModalVisible] = useState(false);
    const [noUpdateAppModalVisible, setNoUpdateAppModalVisible] = useState(false);
    const [deleteUserModal, setDeleteUserModal] = useState(false);
    const [newUserPic, setNewUserPic] = useState(null);
    const [newBanner, setNewBanner] = useState(null);
    const [progress, setProgress] = useState(0);

    const { userBanner, userPic, username, description, email, myUid, userAuth } = route.params;

    useEffect(() => {
        setNewUsername(username);
        setNewDescription(description);
    }, []);

    useEffect(() => {
        const fetchCurrentVersion = async () => {
            const appVersion = Updates.manifest.version;
            setCurrentVersion(appVersion);
        };

        fetchCurrentVersion();
    }, []);

    useEffect(() => {
        if (progress !== 0) {
            Toast.show({
                type: 'info',
                text1: `Salvando dados: ${progress}%`,
                text2: 'Não feche o aplicativo enquanto isso'
            });
        }
    }, [progress])

    const navigation = useNavigation();
    function handleProfileScreen() {
        navigation.navigate('Profile', {});
    }
    function handleSingnScreen() {
        navigation.navigate('SingIn', {});
    }

    const checkUpdates = async () => {
        try {
            const update = await Updates.checkForUpdateAsync();
            if (update.isAvailable) {
                setUpdateAppModalVisible(!updateAppModalVisible);
            } else {
                setNoUpdateAppModalVisible(!noUpdateAppModalVisible);
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Erro ao tentar verificar atualizações ❌',
                text2: 'Tente novamente mais tarde'
            });
            console.error('Erro ao verificar atualizações:', error);
        }
    };

    async function updateApp() {
        setUpdateAppModalVisible(!updateAppModalVisible);
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
            Toast.show({
                type: 'error',
                text1: 'Erro ao tentar atualizar aplicativo ❌',
                text2: 'Tente novamente mais tarde'
            });
        }
    }

    const pickUserPic = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 0.7,
        });

        if (!result.canceled) {
            setNewUserPic(result.assets[0].uri);
        }
    };

    const pickUserBanner = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [16, 7],
            quality: 0.7,
        });

        if (!result.canceled) {
            setNewBanner(result.assets[0].uri);
        }
    };

    async function handleSaveChanges() {
        if (newUsername === username && newDescription === description && !newUserPic && !newBanner) {
            Toast.show({
                type: 'info',
                text1: 'Nenhuma alteração realizada',
            });
        } else if (newUsername === "") {
            Toast.show({
                type: 'error',
                text1: 'Não foi possível realizar alterações 😥',
                text2: 'Confira os campos',
            });
        } else if (newUserPic || newBanner) {
            saveNewImages();
        } else {
            try {
                const userDocRef = doc(db, `user/${myUid}`);
                const userData = {
                    usuario: newUsername,
                    descrição: newDescription
                }
                await updateDoc(userDocRef, userData);

                if (newUserPic || newBanner) {
                    saveNewImages();
                } else {
                    Toast.show({
                        type: 'success',
                        text1: 'Sucesso ao salvar as alterações! 🥳',
                    });
                }
            }
            catch (error) {
                Toast.show({
                    type: 'error',
                    text1: 'Erro ao salvar dados ❌',
                    text2: 'Contate o desenvolvedor '
                });
                console.error("Erro no registro do usuário: ", error);
            }
        }
    }

    async function saveNewImages() {
        if (newUserPic) {
            const blobUserPic = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    resolve(xhr.response);
                };
                xhr.onerror = function (e) {
                    reject(new TypeError('Network request failed'));
                };
                xhr.responseType = 'blob';
                xhr.open('GET', newUserPic, true);
                xhr.send(null);
            });
            const storageRef = ref(storage, `${myUid}/UserPic`);
            const uploadTask = uploadBytesResumable(storageRef, blobUserPic);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progressNumber = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setProgress(parseInt(progressNumber));
                },
                (error) => {
                    Toast.show({
                        type: 'error',
                        text1: 'Error ao salvar imagem 😥',
                    });
                    console.error('Erro ao fazer o upload:', error);
                    throw error;
                }
            );

            try {
                const downloadURL = await getDownloadURL(storageRef);
                const userDocRef = doc(db, `user/${myUid}`);

                await updateDoc(userDocRef, { userPicURL: downloadURL });

                Toast.show({
                    type: 'success',
                    text1: 'Sucesso ao salvar as alterações! 🥳',
                });
            } catch (error) {
                Toast.show({
                    type: 'error',
                    text1: 'Erro ao salvar imagem 😥',
                });
                console.log(`Erro ao postar imagem: ${error}`);
            }
        }
        if (newBanner) {
            const blobBanner = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    resolve(xhr.response);
                };
                xhr.onerror = function (e) {
                    reject(new TypeError('Network request failed'));
                };
                xhr.responseType = 'blob';
                xhr.open('GET', newBanner, true);
                xhr.send(null);
            });
            const storageRef = ref(storage, `${myUid}/banner.jpeg`);
            const uploadTask = uploadBytesResumable(storageRef, blobBanner);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progressNumber = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setProgress(parseInt(progressNumber));
                },
                (error) => {
                    Toast.show({
                        type: 'error',
                        text1: 'Error ao salvar imagem 😥',
                    });
                    console.error('Erro ao fazer o upload:', error);
                    throw error;
                }
            );

            try {
                const downloadURL = await getDownloadURL(storageRef);
                const userDocRef = doc(db, `user/${myUid}`);

                await updateDoc(userDocRef, { bannerURL: downloadURL });

                Toast.show({
                    type: 'success',
                    text1: 'Sucesso ao salvar as alterações! 🥳',
                });
            } catch (error) {
                Toast.show({
                    type: 'error',
                    text1: 'Erro ao salvar imagem 😥',
                });
                console.log(`Erro ao postar imagem: ${error}`);
            }
        }
    }

    // Excluir usuáio e dados (FireStore e FireStorage)
    async function handleDeleteUser() {
        try {
            await deleteUser(userAuth);

            //Dados do Firestore
            const likedPostsDoc = doc(db, `user/${myUid}/likedPosts/postReference`);
            await deleteDoc(likedPostsDoc);
            const userCollectionRefDelete = collection(db, "user");
            const userDocRefDelete = doc(userCollectionRefDelete, myUid);
            await deleteDoc(userDocRefDelete);

            // Coleção "post"
            const postCollectionRef = collection(db, `user/${myUid}/post`);
            const postDocs = await getDocs(postCollectionRef);
            postDocs.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });
            await deleteDoc(postCollectionRef.parent);

            // Coleção "seguindo"
            const followingCollectionRef = collection(db, `user/${myUid}/seguindo`);
            const followingDocs = await getDocs(followingCollectionRef);
            followingDocs.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });
            await deleteDoc(followingCollectionRef.parent);

            // Excluir arquivos no Firebase Storage
            try {
                const userPicRef = ref(storage, `${myUid}/UserPic`);
                const bannerRef = ref(storage, `${myUid}/banner.jpeg`);
                await deleteObject(userPicRef);
                await deleteObject(bannerRef);
            }
            catch (error) {
                console.log(`Não foi possível excluir usuário: ${error}`)
            }

            Toast.show({
                type: 'success',
                text1: 'Usuário excluido com sucesso!',
                text2: 'Até logo 🥺',
            });
            handleSingnScreen();
        }
        catch (error) {
            if (error.message == "Firebase: Error (auth/requires-recent-login).") {
                Toast.show({
                    type: 'error',
                    text1: 'Exclusão de usuário mal sucedida 😥',
                    text2: 'É necessário ter logado recentemente para exclui-la',
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error ao excluir usuário ❌',
                    text2: 'Contate o desenvolvedor',
                });
                console.log(`Erro ao excluir perfil: ${error.message}`);
            }
        }
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

            <Modal
                animationType="none"
                transparent={true}
                visible={deleteUserModal}
                onRequestClose={() => {
                    setUpdateAppModalVisible(!deleteUserModal);
                }}>
                <Pressable style={styles.updateAppContainer} onPress={() => setUpdateAppModalVisible(!deleteUserModal)}>
                    <View style={styles.updateAppModal}>
                        <Text style={styles.titleModal}>
                            Excluir conta?
                        </Text>
                        <Text style={styles.textModal}>
                            Tem certeza de que deseja excluir sua conta?
                        </Text>
                        <View style={styles.buttonModal} >
                            <AppButton
                                onPress={() => setDeleteUserModal(!deleteUserModal)}
                                text={"Cancelar"}
                                fontSize={12}
                                paddingHorizontal={8}
                            />
                            <AppButton
                                onPress={() => handleDeleteUser()}
                                text={"Confirmar"}
                                backgroundColor={"#A01212"}
                                fontSize={12}
                                paddingHorizontal={8} />
                        </View>
                    </View>
                </Pressable>
            </Modal>

            <Modal
                animationType="none"
                transparent={true}
                visible={noUpdateAppModalVisible}
                onRequestClose={() => {
                    setNoUpdateAppModalVisible(!noUpdateAppModalVisible);
                }}>
                <Pressable style={styles.updateAppContainer} onPress={() => setNoUpdateAppModalVisible(!noUpdateAppModalVisible)}>
                    <View style={styles.updateAppModal}>
                        <Text style={styles.titleModal}>
                            Aplicativo já está atualizado
                        </Text>
                        <Text style={styles.textModal}>
                            Não há atualizações disponíveis no momento.
                        </Text>
                        <View style={styles.buttonModal} >
                            <AppButton
                                onPress={() => setNoUpdateAppModalVisible(!noUpdateAppModalVisible)}
                                text={"Fechar"}
                                fontSize={12}
                                paddingHorizontal={8} />
                        </View>
                    </View>
                </Pressable>
            </Modal>

            <BackHeader changeScreen={handleProfileScreen} description={"CONFIGURAÇÕES DO PERFIL"}>
                <LogOut />
            </BackHeader>
            <View style={styles.config}>
                <TouchableOpacity style={styles.bannerContainer} activeOpacity={0.5} onPress={() => pickUserBanner()}>
                    <Image style={styles.banner} source={newBanner ? { uri: newBanner } : userBanner} />
                    <TouchableOpacity style={styles.centeredUserPicContainer} activeOpacity={0.5} onPress={() => pickUserPic()}>
                        <Image style={styles.userPic} source={newUserPic ? { uri: newUserPic } : userPic} />
                    </TouchableOpacity>
                </TouchableOpacity>
                <View style={styles.textContent}>
                    <Text style={styles.label}>
                        Nome:
                    </Text>
                    <TextInput maxLength={20} onChangeText={setNewUsername}>
                        <Text style={styles.username}>
                            {username}
                        </Text>
                    </TextInput>
                </View>
                <View style={styles.textContent}>
                    <Text style={styles.label}>
                        Biografia:
                    </Text>
                    <View style={styles.newBio}>
                        <Text style={styles.bioLabel}>
                            "
                        </Text>
                        <TextInput maxLength={50} onChangeText={setNewDescription} style={styles.bio}>
                            <Text>
                                {description}
                            </Text>
                        </TextInput>
                        <Text style={styles.bioLabel}>
                            "
                        </Text>
                    </View>
                </View>
                <View style={styles.textContent}>
                    <Text style={styles.label}>
                        Email:
                    </Text>
                    <Text style={styles.email}>
                        {email}
                    </Text>
                </View>
                <View style={styles.btnSection}>
                    <AppButton text={"Salvar alterações"} onPress={handleSaveChanges} />
                    <AppButton text={"Atualizar Sandbox"} backgroundColor={'#000000'} onPress={checkUpdates} />
                    <AppButton text={"Excluir conta"} backgroundColor={'#A01212'} onPress={() => setDeleteUserModal(!deleteUserModal)} />
                </View>
            </View>
        </>
    );
};
