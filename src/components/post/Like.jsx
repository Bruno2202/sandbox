import { StyleSheet, TouchableOpacity, Text } from "react-native"
import { useEffect, useState } from "react";
import { AntDesign } from '@expo/vector-icons';

import { doc, setDoc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../../../firebaseConfig";
import Toast from "react-native-toast-message";

export default function Like({ postId, postUserUid, myProfile }) {

    const [likeColor, setLikeColor] = useState('#8B8B8B');
    const [numLike, setNumLike] = useState(null);
    const [liked, setLiked] = useState(null);
    const [userUid, setUserUid] = useState(null);
    const [canLike, setCanLike] = useState(true);

    useEffect(() => {
        onAuthStateChanged(getAuth(), (user) => {
            setUserUid(user ? user.uid : null);
        });
    }, [])

    useEffect(() => {
        getLikedPosts();
        getLikes();

        const postDocRefLike = doc(db, `posts/${postUserUid}-${postId}`);
        const unsubscribeLike = onSnapshot(postDocRefLike, (doc) => {
            if (doc.exists()) {
                setNumLike(doc.data().like);
            }
        });

        const postDocRefLiked = doc(db, `user/${userUid}/likedPosts/${postUserUid}-${postId}`);
        const unsubscribeLiked = onSnapshot(postDocRefLiked, (doc) => {
            if (doc.exists()) {
                setLikeColor(doc.data().liked ? '#0060CE' : '#8B8B8B');
            }
        });

        return () => {
            unsubscribeLike();
            unsubscribeLiked();
        };
    }, [userUid]);

    async function getLikes() {
        try {
            let targetUid = myProfile ? userUid : postUserUid;
            const docRef = await getDoc(doc(db, `posts/${targetUid}-${postId}`));
            setNumLike(docRef.data().like);
        } catch (error) {
            // console.log(`Erro ao obter número de like: ${error}`);
        }
    }

    async function getLikedPosts() {
        var targetUid = myProfile ? userUid : postUserUid;
        try {
            const userRef = await getDoc(doc(db, `user/${userUid}/likedPosts/${targetUid}-${postId}`));
            if (userRef.data().liked === true) {
                setLikeColor('#0060CE');
            } else {
                setLikeColor('#8B8B8B');
            }
        } catch (error) {
            // console.log(`Erro ao obter status do like: ${error} // docInfo: "user/${userUid}/likedPosts/${targetUid}-${postId}" `)
        }
    }

    function likeOrUnlike() {
        setCanLike(false);

        const likedDocRef = doc(db, `user/${userUid}/likedPosts/${postUserUid}-${postId}`);
        const numLikeDocRef = doc(db, `posts/${postUserUid}-${postId}`);

        try {
            getDoc(numLikeDocRef)
                .then((postData) => {
                    const numLikes = postData.data().like;

                    function deslike() {
                        getDoc(likedDocRef)
                            .then((likedPostData) => {
                                if (likedPostData.exists() && likedPostData.data().liked === true) {
                                    updateDoc(numLikeDocRef, { like: numLikes - 1 })
                                        .then(() => {
                                            updateDoc(likedDocRef, { liked: false })
                                                .then(() => {
                                                    setCanLike(true);
                                                });
                                        })
                                } else {
                                    setCanLike(true);
                                }
                            });
                    }

                    function like() {
                        getDoc(likedDocRef)
                            .then((likedPostData) => {
                                if (likedPostData.exists() && likedPostData.data().liked === false) {
                                    updateDoc(numLikeDocRef, { like: numLikes + 1 })
                                        .then(() => {
                                            updateDoc(likedDocRef, { liked: true })
                                                .then(() => {
                                                    setCanLike(true);
                                                });
                                        });
                                } else {
                                    setDoc(likedDocRef, { liked: false })
                                        .then((likedPostData) => {
                                            updateDoc(numLikeDocRef, { like: numLikes + 1 })
                                                .then(() => {
                                                    updateDoc(likedDocRef, { liked: true })
                                                        .then(() => {
                                                            setCanLike(true);
                                                        });
                                                });
                                        })
                                    setCanLike(true);
                                }
                            });
                    }

                    getDoc(likedDocRef)
                        .then((likedPostData) => {
                            if (likedPostData.exists() && likedPostData.data().liked === true) {
                                deslike();
                            } else if (likedPostData.exists() && likedPostData.data().liked === false) {
                                like();
                            } else {
                                like();
                            }
                        });
                });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Erro ao dar like ou deslike ❌',
                text2: 'Tente novamente mais tarde ou contate o desenvolvedor'
            });
            console.log(`Erro ao dar like ou deslike: ${error}`);
        }
    }

    return (
        <>
            <TouchableOpacity style={styles.like} onPress={() => canLike === true && likeOrUnlike()}>
                <AntDesign name="like1" size={24} color={likeColor} />
                <Text style={styles.text}>
                    {numLike}
                </Text>
            </TouchableOpacity>
        </>
    );
}

const styles = StyleSheet.create({
    like: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 8
    },
    text: {
        fontFamily: 'KantumruyProMedium',
        fontSize: 16,
        color: '#FFFFFF',
        marginLeft: 4,
        marginRight: 20,
        textAlign: 'center',
        justifyContent: 'center'
    },
});