import { View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getDoc, doc, setDoc, collection, addDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../../firebaseConfig';

import styles from './style'
import BackHeader from '../../components/BackHeader';
import AppButton from '../../components/AppButton';
import CreatePostInput from '../../components/inputs/CreatePostInput';

export default function CreatePost({ route }) {

    const [text, setText] = useState("");
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (progress !== 0) {
            Toast.show({
                type: 'info',
                text1: `Carregando postagem: ${progress}%`,
                text2: 'Não feche o aplicativo enquanto isso'
            });
        }
    }, [progress])

    const { myUid } = route.params

    const navigation = useNavigation();
    function handleFeedScreen() {
        navigation.navigate("Feed", {});
    }

    function validatePost() {
        if (text === "" && !image) {
            Toast.show({
                type: 'error',
                text1: 'Vai postar nada né? Beleza 👍',
                text2: 'Postagem sem conteudo (texto ou imagem)'
            });
        } else {
            publishPost();
        }
    }

    async function publishPost() {
        const docSnap = await getDoc(doc(db, "user", myUid));
        if (docSnap.exists()) {
            var usuario = docSnap.data().usuario;
        } else {
            console.log("Não foi possível encontrar nome de usuário");
        }

        const userPostRef = collection(db, `user/${myUid}/post`);
        const postData = {
            texto: text,
            timestamp: new Date,
            userUid: myUid,
            usuario: usuario,
            fotoURL: ""
        }

        try {
            var postId = await addDoc(userPostRef, postData);

            const postData2 = {
                like: 0,
                comment: 0,
                texto: text,
                timestamp: new Date,
                userUid: myUid,
                usuario: usuario,
                postId: postId.id,
                fotoURL: ""
            }

            const userPostRef2 = doc(db, `posts/${myUid}-${postId.id}`);
            await setDoc(userPostRef2, postData2);

            // Upload da imagem
            if (image) {
                uploadImageAndSetURL(postId.id);
            } else {
                Toast.show({
                    type: 'success',
                    text1: 'Postagem realizada com sucesso! 🥳',
                });
                handleFeedScreen();
            }

        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Não foi possível realizar postagem 😥',
            });
            console.log(`Erro ao realizar postagens: ${error}`);
        }
    }

    //Upar imagem na postagem
    async function uploadImageAndSetURL(postId) {

        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', image, true);
            xhr.send(null);
        });

        const storageRef = ref(storage, `${myUid}/posts/${postId}/postPhoto`);
        const uploadTask = uploadBytesResumable(storageRef, blob);

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
            await uploadTask;
            const downloadURL = await getDownloadURL(storageRef);

            const updateURLPhotoPosts = doc(db, `posts/${myUid}-${postId}`);
            const updateURLPhotoUserPost = doc(db, `user/${myUid}/post/${postId}`);

            await updateDoc(updateURLPhotoPosts, { fotoURL: downloadURL });
            await updateDoc(updateURLPhotoUserPost, { fotoURL: downloadURL });

            Toast.show({
                type: 'success',
                text1: 'Postagem realizada com sucesso! 🥳',
            });

            handleFeedScreen();
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Erro ao salvar imagem 😥',
            });
            console.log(`Erro ao postar imagem: ${error}`);
        }
    }

    return (
        <>
            <BackHeader changeScreen={handleFeedScreen}>
                <Image source={require('../../assets/img/miniLogo.png')} style={styles.miniLogo} />
                <AppButton text={"Publicar"} paddingHorizontal={8} paddingVertical={4} borderRadius={50} fontSize={12} onPress={() => validatePost()} />
            </BackHeader>
            <View style={styles.createPost}>
                <CreatePostInput setText={setText} image={image} setImage={setImage} allowsPhotos={true} />
            </View>
        </>
    );
}
