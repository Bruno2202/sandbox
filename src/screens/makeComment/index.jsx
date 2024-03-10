import { View, Image, TouchableOpacity } from "react-native"
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import Toast from "react-native-toast-message";

import { addDoc, doc, getDoc, updateDoc, collection } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../../../firebaseConfig";

import styles from "./style";
import BackHeader from "../../components/BackHeader";
import Post from "../../components/post/Post";
import CreatePostInput from "../../components/inputs/CreatePostInput";

export default function MakeComment({ route }) {

    const [text, setText] = useState("");
    const [myUid, setMyUid] = useState("");

    useEffect(() => {
        onAuthStateChanged(getAuth(), (user) => {
            setMyUid(user.uid);
        });
    }, [])

    const {
        postId,
        postUserUid,
        myProfile,
        username,
        userUid,
        userPic,
        textFetched,
        imageFetched,
        showInteractions,
        showTime
    } = route.params

    const navigation = useNavigation();
    function handleFeedScreen() {
        navigation.navigate("Feed", {});
    }

    async function handlePostComment() {
        if (text === "") {
            Toast.show({
                type: 'error',
                text1: 'Comentário sem comentário não é comentário 🤡',
                text2: 'Escreva algo antes de comentar',
            });
        } else {
            try {
                const userLogedReference = doc(db, `user/${myUid}`);
                const userLogedData = await getDoc(userLogedReference);
                const commentaryLocation = collection(db, `user/${userUid}/post/${postId}/comentarios`);
                const commentaryData = {
                    texto: text,
                    data: new Date,
                    postId: postId,
                    commentUserUid: userUid,
                    commentUsername: username,
                    logedUserUid: myUid,
                    logedUserUsername: userLogedData.data().usuario
                }

                const docRef = await addDoc(commentaryLocation, commentaryData);
                const newDocumentId = docRef.id;
                const newCommentLocation = doc(db, `user/${userUid}/post/${postId}/comentarios/${newDocumentId}`);
                await updateDoc(newCommentLocation, {
                    commentId: newDocumentId
                });

                const commentDocRef = doc(db, `posts/${userUid}-${postId}`);
                const numCommentsPosts = await getDoc(commentDocRef);
                var numComments = numCommentsPosts.data().comment;
                await updateDoc(commentDocRef, {
                    comment: numComments + 1
                });

                Toast.show({
                    type: 'success',
                    text1: 'Comentário realizado com sucesso! 🥳',
                });
                handleFeedScreen();
            }
            catch (error) {
                Toast.show({
                    type: 'error',
                    text1: 'Não foi possível realizar o comentário 😥',
                    text2: 'Tente novamente mais tarde',
                });
                console.log(`Erro ao realizar comentário: ${error}`);
            }
        }
    }

    return (
        <>
            <BackHeader changeScreen={() => handleFeedScreen()}>
                <Image source={require('../../assets/img/miniLogo.png')} style={styles.miniLogo} />
            </BackHeader>
            <View style={styles.createComment}>
                <Post
                    key={postId}
                    postId={postId}
                    postUserUid={postUserUid}
                    myProfile={myProfile}
                    username={username}
                    userUid={userUid}
                    userPic={userPic}
                    textFetched={textFetched}
                    imageFetched={imageFetched}
                    showInteractions={showInteractions}
                    showTime={showTime}
                    marginVertical={'none'}
                    borderRadius={4}
                    allowsPhotos={false}
                />
                <CreatePostInput marginTop={20} marginHorizontal={0.01} setText={setText} placeholder={`Comente a publicação de @${username}`}>
                    <TouchableOpacity onPress={() => handlePostComment()} style={styles.sendCommnet}>
                        <Ionicons style={styles.sendIcon} name="send" size={24} color="#0060CE" />
                    </TouchableOpacity>
                </CreatePostInput>
            </View>
        </>
    );
};
