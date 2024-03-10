import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, Pressable } from "react-native"
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, Feather } from '@expo/vector-icons';
import Toast from "react-native-toast-message";

import { collection, deleteDoc, doc, getDoc, getDocs, increment, updateDoc } from "firebase/firestore";
import { ref, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "../../../firebaseConfig";

import Like from "./Like";
import Comment from "./Comment";
import Time from "./Time";
import AppButton from "../AppButton";

export default function Post({
    userUid,
    postId,
    textFetched,
    imageFetched,
    timeFeched,
    myProfile,
    marginVertical,
    borderRadius,
    marginBottom,
    showInteractions,
    showTime,
    canOpen,
    canDelete,
    postType,
    commentPostId,
    userPostUid,
    realoadPage
}) {

    const [userPic, setUserPic] = useState(null);
    const [username, setUsername] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [deletePostModalVisible, setDeletePostModalVisible] = useState(false);
    const [marginV, setMarginV] = useState(marginVertical ? marginVertical : 8);
    const [borderR, setBorderR] = useState(borderRadius ? borderRadius : 4);
    const [marginB, setMarginB] = useState(marginBottom ? marginBottom : 0);

    useEffect(() => {
        loadUserPicFetched();
    }, []);

    useEffect(() => {
        fetchUsername();
    }, [userUid]);

    const navigation = useNavigation();
    function handleProfileScreen() {
        navigation.navigate("Profile", {
            userPic: userPic,
            uid: userUid
        });
    }
    function handleFullPost() {
        navigation.navigate("FullPost", {
            userUid: userUid,
            postId: postId,
            textFetched: textFetched,
            imageFetched: imageFetched,
            timeFeched: timeFeched,
            myProfile: myProfile,
            showTime: showTime,
            username: username
        });
    }
    function handleFeedScreen() {
        navigation.navigate("Feed", {})
    }
    async function loadUserPicFetched() {
        const storageRef = ref(storage, `${userUid}/UserPic`);
        try {
            const imageUrl = await getDownloadURL(storageRef);
            setUserPic({ uri: imageUrl });
        } catch (error) {
            const defaultUserPic = require('../../assets/img/userPic.png');
            setUserPic(defaultUserPic);
        }
    }

    async function fetchUsername() {
        const userDocData = await getDoc(doc(db, `user/${userUid}`));
        setUsername(userDocData.data().usuario);
    }

    async function deletePost() {
        try {
            const dataRef1 = collection(db, 'user');
            const querySnapshot1 = await getDocs(dataRef1);

            querySnapshot1.forEach(async (doc1) => {
                const dataRef2 = collection(db, `user/${doc1.id}/likedPosts`);
                const querySnapshot2 = await getDocs(dataRef2);

                querySnapshot2.forEach(async (doc2) => {
                    if (doc2.id == `${userUid}-${postId}`) {
                        const docUserRef = doc(db, `user/${doc1.id}/likedPosts/${doc2.id}`)
                        await deleteDoc(docUserRef);
                    }
                })
            });

            //Deleta o post do perfil
            const commentsPostDocRef = await getDocs(collection(db, `user/${userUid}/post/${postId}/comentarios`));
            commentsPostDocRef.forEach(async (comments) => {
                await deleteDoc(comments.ref);
            });
            const userPostCollectionRefDelete = collection(db, `user/${userUid}/post`);
            const userPostDocRef = doc(userPostCollectionRefDelete, postId);
            await deleteDoc(userPostDocRef);

            //Deleta o post do feed
            const feedPostCollectionRefDelete = doc(db, `posts/${userUid}-${postId}`);
            await deleteDoc(feedPostCollectionRefDelete);

            //Deleta o post do storage
            try {
                const postPhotoRef = ref(storage, `${userUid}/posts/${postId}/postPhoto`);
                await deleteObject(postPhotoRef);
            } catch (error) {
                if (error == `FirebaseError: Firebase Storage: Object '${userUid}/posts/${postId}/postPhoto' does not exist. (storage/object-not-found)`) {
                } else {
                    console.log(`Erro ao deletar referência de imagem: ${error}`);
                }
            }

            Toast.show({
                type: 'success',
                text1: 'Postagem excluida com sucesso! 🥳'
            });

            setDeletePostModalVisible(!deletePostModalVisible);
        }
        catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Não foi possível excluir postagem 😥'
            });
            console.log(`Não foi possível excluir o post: ${error}`);
        }
    }

    async function deleteComment() {
        try {
            const postCommentRef = doc(db, `posts/${userPostUid}-${commentPostId}`)
            const userPostCollectionRefDelete = collection(db, `user/${userPostUid}/post/${commentPostId}/comentarios`);
            const userPostDocRef = doc(userPostCollectionRefDelete, postId);
            await deleteDoc(userPostDocRef);
            await updateDoc(postCommentRef, {
                comment: increment(-1)
            });
            Toast.show({
                type: 'success',
                text1: 'Comentário exlcuido com sucesso! 🥳'
            });

            handleFeedScreen();
        }
        catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Não foi possível excluir comentário 😥'
            });
            console.log(`Erro ao excluir comentário: ${error}`);
        }
    }

    return (
        <>
            <Modal
                animationType="none"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <Pressable style={styles.openImage} onPress={() => setModalVisible(!modalVisible)}>
                    <TouchableOpacity style={styles.closeImage} onPress={() => setModalVisible(!modalVisible)}>
                        <AntDesign name="close" size={32} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Image style={styles.imageFullSize} source={{ uri: imageFetched }} />
                </Pressable>
            </Modal>

            <Modal
                animationType="none"
                transparent={true}
                visible={deletePostModalVisible}
                onRequestClose={() => {
                    setDeletePostModalVisible(!deletePostModalVisible);
                }}>
                <Pressable style={styles.deletePostArea} onPress={() => setDeletePostModalVisible(!deletePostModalVisible)}>
                    <View style={styles.deltePostModal}>
                        {postType === "post" ? (
                            <>
                                <Text style={styles.titleModal}>
                                    Deletar post? 🤔
                                </Text>
                                <Text style={styles.textModal}>
                                    Esta ação resultará na exclusão permanentemente da postagem no feed e no seu perfil.
                                </Text>
                                <View style={styles.buttonModal} >
                                    <AppButton
                                        onPress={() => setDeletePostModalVisible(!deletePostModalVisible)}
                                        text={"Cancelar"}
                                        fontSize={12}
                                        paddingHorizontal={8}
                                    />
                                    <AppButton
                                        onPress={() => deletePost()}
                                        text={"Excluir"}
                                        backgroundColor={"#A01212"}
                                        fontSize={12}
                                        paddingHorizontal={8} />
                                </View>
                            </>
                        ) : postType === "comment" && (
                            <>
                                <Text style={styles.titleModal}>
                                    Deletar comentário? 🤔
                                </Text>
                                <Text style={styles.textModal}>
                                    Esta ação resultará na exclusão permanentemente do comentário da postagem.
                                </Text>
                                <View style={styles.buttonModal} >
                                    <AppButton
                                        onPress={() => setDeletePostModalVisible(!deletePostModalVisible)}
                                        text={"Cancelar"}
                                        fontSize={12}
                                        paddingHorizontal={8}
                                    />
                                    <AppButton
                                        onPress={() => deleteComment()}
                                        text={"Excluir"}
                                        backgroundColor={"#A01212"}
                                        fontSize={12}
                                        paddingHorizontal={8} />
                                </View>
                            </>
                        )}
                    </View>
                </Pressable>
            </Modal>


            <Pressable style={{ ...styles.post, marginVertical: marginV, borderRadius: borderR, marginBottom: marginB }} onPress={() => canOpen && handleFullPost()}>
                <TouchableOpacity style={styles.userPicContent} onPress={handleProfileScreen}>
                    <Image style={styles.userPic} source={userPic} />
                </TouchableOpacity>
                <View style={styles.postContent}>
                    <Text style={styles.username}>
                        {username}
                    </Text>
                    {myProfile && canDelete &&
                        <TouchableOpacity style={styles.trashBtn} onPress={() => setDeletePostModalVisible(true)} >
                            <Feather name="trash-2" size={16} color="#848484" />
                        </TouchableOpacity>
                    }
                    {textFetched && (
                        <Text style={styles.textContent}>
                            {textFetched}
                        </Text>
                    )}
                    {imageFetched && (
                        <TouchableOpacity activeOpacity={0.5} onPress={() => setModalVisible(true)} style={styles.imageContainer} >
                            <Image style={styles.imageContent} source={{ uri: imageFetched }} />
                        </TouchableOpacity>
                    )}
                    {showInteractions && (
                        <View style={styles.postInteractions}>
                            <Like postId={postId} postUserUid={userUid} myProfile={myProfile} />
                            <Comment
                                postId={postId}
                                postUserUid={userUid}
                                myProfile={myProfile}
                                username={username}
                                userUid={userUid}
                                userPic={userPic}
                                textFetched={textFetched}
                                imageFetched={imageFetched}
                                showInteractions={false}
                                showTime={false}
                            />
                        </View>
                    )}
                    {showTime && (
                        <View style={styles.time}>
                            <Time timeFeched={timeFeched} />
                        </View>
                    )}
                </View>
            </Pressable >
        </>
    );
}

const styles = StyleSheet.create({
    post: {
        height: 'auto',
        flexDirection: 'row',
        backgroundColor: '#3D3D3D',
        padding: 4,
    },
    userPicContent: {
        alignItems: 'flex-start',
        marginBottom: 'auto',
    },
    userPic: {
        resizeMode: 'contain',
        width: 40,
        height: 40,
        borderRadius: 50,
    },
    postContent: {
        flex: 1,
        marginLeft: 8,
    },
    username: {
        fontSize: 16,
        color: '#FFFFFF',
        fontFamily: 'KantumruyProMedium',
    },
    trashBtn: {
        position: 'absolute',
        top: 4,
        right: 4,
    },
    textContent: {
        marginTop: 2,
        flexWrap: 'wrap',
        fontFamily: 'KantumruyProRegular',
        color: '#FFFFFF',
    },
    imageContainer: {
        marginTop: 4,
        marginRight: 8,
        marginBottom: 4,
    },
    imageContent: {
        resizeMode: 'cover',
        width: '100%',
        height: 300,
        marginTop: 8,
        borderRadius: 4,
    },
    postInteractions: {
        marginTop: 8,
        flexDirection: 'row',
    },
    time: {
        alignItems: 'flex-end',
    },

    openImage: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeImage: {
        justifyContent: 'flex-end',
        position: 'absolute',
        right: 12,
        top: 12,
        zIndex: 1,
    },
    imageFullSize: {
        resizeMode: 'contain',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        aspectRatio: 1,
        width: '100%',
    },

    deletePostArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    deltePostModal: {
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
