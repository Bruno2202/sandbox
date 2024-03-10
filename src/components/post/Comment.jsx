import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { useState, useEffect } from "react";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

export default function Comment({
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
}) {

    const [numComment, setNumComment] = useState(null);

    useEffect(() => {
        getComments();

        const postDocRefComment = doc(db, `posts/${postUserUid}-${postId}`);
        const unsubscribeComment = onSnapshot(postDocRefComment, (doc) => {
            if (doc.exists()) {
                setNumComment(doc.data().comment);
            }
        });

        return () => {
            unsubscribeComment();
        };
    }, [userUid]);

    const navigation = useNavigation();
    function handleMakeCommentScreen() {
        navigation.navigate("MakeComment", {
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
        });
    }

    async function getComments() {
        try {
            const docRef = await getDoc(doc(db, `posts/${postUserUid}-${postId}`));
            setNumComment(docRef.data().comment);
        } catch (error) {
            console.log(`Erro ao obter número de comentários: ${error}`)
        }
    }

    return (
        <>
            <TouchableOpacity style={styles.comment} onPress={handleMakeCommentScreen}>
                <MaterialCommunityIcons name="comment" size={24} color="#8B8B8B" />
                <Text style={styles.text}>
                    {numComment}
                </Text>
            </TouchableOpacity>
        </>
    );
}

const styles = StyleSheet.create({
    comment: {
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
        justifyContent: 'center',
    },
});