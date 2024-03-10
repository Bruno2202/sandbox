import { View, FlatList, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';

import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDownloadURL, ref } from 'firebase/storage';
import { db, storage } from '../../../firebaseConfig';

import styles from './style';
import LoadingPosts from '../../components/post/LoadingPosts';
import BackHeader from '../../components/BackHeader';
import Post from '../../components/post/Post';
import Separator from '../../components/Separator';
import CreateCommentInput from '../../components/inputs/CreateCommentInput';

export default function FullPost({ route }) {

    const [data, setData] = useState([]);
    const [myUid, setMyUid] = useState("");
    const [text, setText] = useState("");
    const [userPic, setUserPic] = useState();

    useEffect(() => {
        fetchComments();
        onAuthStateChanged(getAuth(), (user) => {
            setMyUid(user.uid);
        })
    }, []);

    useEffect(() => {
        if (myUid !== "") {
            const storageRef = ref(storage, `${myUid}/UserPic`);
            getDownloadURL(storageRef)
                .then((url) => {
                    setUserPic({ uri: url })
                })
                .catch((error) => {
                    setUserPic(require('../../assets/img/userPic.png'))
                });
        }
    }, [myUid]);

    const { userUid, postId, textFetched, imageFetched, timeFeched, myProfile, username } = route.params

    const navigation = useNavigation();
    function handleFeedScreen() {
        navigation.navigate("Feed", {});
    }

    async function fetchComments() {
        const commentsQuerySnapshot = await getDocs(query(
            collection(db, `user/${userUid}/post/${postId}/comentarios`),
            orderBy('data', 'asc'))
        );

        const commentsData = commentsQuerySnapshot.docs.map((doc) => doc.data());
        setData(commentsData);
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
            <BackHeader description={"POST"} changeScreen={handleFeedScreen} />
            <View style={styles.fullPost}>
                {data.length === 0 ? (
                    <View style={{...styles.postContent, flex: 1}}>
                        <Post
                            userUid={userUid}
                            postId={postId}
                            textFetched={textFetched}
                            imageFetched={imageFetched}
                            timeFeched={timeFeched}
                            myProfile={myProfile}
                            marginVertical={'none'}
                            showTime={true}
                            postType={"post"}
                        />
                        <LoadingPosts text={"Esta postagem não possui comentários.\nSeja a primeira pessoa a comentar!"} />
                    </View>
                ) : (
                    <FlatList
                        data={[{ post: true, ...data[0] }, ...data.slice(0)]}
                        renderItem={({ item }) => {
                            if (item.post) {
                                return (
                                    <>
                                        <View style={styles.postContent}>
                                            <Post
                                                key={postId + '_post'}
                                                userUid={userUid}
                                                postId={postId}
                                                textFetched={textFetched}
                                                imageFetched={imageFetched}
                                                timeFeched={timeFeched}
                                                myProfile={myProfile}
                                                marginVertical={'none'}
                                                borderRadius={4}
                                                showTime={true}
                                                postType={"post"}
                                            />
                                        </View>
                                        <Separator />
                                        <View style={styles.label}>
                                            <Text style={styles.textLabel}>
                                                Comentários:
                                            </Text>
                                        </View>
                                    </>
                                );
                            } else {
                                return (
                                    <View style={styles.commentContent}>
                                        <Post
                                            key={item.commentId}
                                            postId={item.commentId}
                                            commentPostId={item.postId}
                                            userUid={item.logedUserUid}
                                            userPostUid={item.commentUserUid}
                                            textFetched={item.texto}
                                            timeFeched={item.data}
                                            showTime={true}
                                            canOpen={false}
                                            postType={"comment"}
                                            myProfile={myUid === item.logedUserUid ? true : false}
                                            canDelete={true}
                                        />
                                    </View>
                                );
                            }
                        }}
                    />
                )}
                <Separator />
                <CreateCommentInput userPic={userPic} onPress={() => handlePostComment()} onChangeText={setText} />
            </View>
        </>
    );
};
