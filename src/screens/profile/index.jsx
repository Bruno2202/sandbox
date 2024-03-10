import { View, ScrollView, Text, Image } from "react-native"
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { ref, getDownloadURL } from "firebase/storage";
import { doc, getDoc, getDocs, query, collection, orderBy, updateDoc, setDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db, storage } from "../../../firebaseConfig";

import styles from "./style";
import BackHeader from "../../components/BackHeader";
import LoadingPosts from '../../components/post/LoadingPosts';
import Post from "../../components/post/Post";
import ProfileHeader from '../../components/ProfileHeader';

export default function Profile({ route }) {

    const [userBanner, setUserBanner] = useState(null);
    const [userPic, setUserPic] = useState(null);
    const [userPosts, setUserPosts] = useState(null);
    const [myUid, setMyUid] = useState(null);
    const [userUid, setUserUid] = useState(null);
    const [userData, setUserData] = useState(null);
    const [username, setUsername] = useState("Carregando...");
    const [description, setDescripiton] = useState("Carregando...");
    const [email, setEmail] = useState(null);
    const [myProfile, setMyProfile] = useState(false);
    const [userAuth, setUserAuth] = useState(null);
    const [phrases, setPhrases] = useState("");

    const { uid } = route.params

    
    useEffect(() => {
        onAuthStateChanged(getAuth(), (user) => {
            setMyUid(user.uid);
            setUserAuth(user)
            user.uid === uid ? setMyProfile(true) : setMyProfile(false);
        });
        fetchUserPic();
        fetchUserBanner();
        fetchPosts();
    }, []);

    useEffect(() => {
        setUserUid(uid);
    }, [myUid, uid]);

    useEffect(() => {
        fetchUserData();
    }, [userUid]);

    useEffect(() => {
        if (userData !== null) {
            setUsername(userData.data().usuario);
            setDescripiton(userData.data().descrição);
            setEmail(userData.data().email);
        }
    }, [userData]);

    useEffect(() => {
        if (username !== "Carregando...") {
            if (!userPosts && userData) {
                noPosts();
            }
        }
    }, [username]);

    
    const navigation = useNavigation();
    function handleGoBackScreen() {
        navigation.goBack();
    }

    const handleReload = () => {
        setForceUpdate(prevState => !prevState);
    };

    function fetchUserBanner() {
        const storageRefUserBanner = ref(storage, `${uid}/banner.jpeg`);
        const storageRefDefaultBanner = ref(storage, `defaultImages/banner.png`);
        getDownloadURL(storageRefUserBanner)
            .then((url) => {
                setUserBanner({ uri: url });
            })
            .catch((error) => {
                getDownloadURL(storageRefDefaultBanner)
                    .then((url) => {
                        setUserBanner({ uri: url });
                    })
                if (error == `FirebaseError: Firebase Storage: Object '${uid}/banner.jpeg' does not exist. (storage/object-not-found)`) {
                } else {
                    console.log(`Não foi possível carregar banner do usuário: ${error}`)
                }
            });
    }

    function fetchUserPic() {
        const storageRefUserPic = ref(storage, `${uid}/UserPic`);
        const storageRefDefaultUserPic = ref(storage, `defaultImages/userPic.png`);
        getDownloadURL(storageRefUserPic)
            .then((url) => {
                setUserPic({ uri: url });
            })
            .catch((error) => {
                getDownloadURL(storageRefDefaultUserPic)
                    .then((url) => {
                        setUserPic({ uri: url });
                    })
                if (error == `FirebaseError: Firebase Storage: Object '${uid}/UserPic' does not exist. (storage/object-not-found)`) {
                } else {
                    console.log(`Não foi possível carregar banner do usuário: ${error}`)
                }
            });
    }

    async function fetchUserData() {
        try {
            const userRef = await getDoc(doc(db, `user/${userUid}`));
            if (userRef.exists()) {
                setUserData(userRef);
            }
        } catch (error) {
            console.error("Erro ao buscar dados do usuário:", error);
        }
    }

    async function fetchPosts() {
        try {
            const postsQuerySnapshot = await getDocs(query(collection(db, `user/${uid}/post`), orderBy('timestamp', 'desc')));

            if (postsQuerySnapshot.docs.length === 0) {
            } else {
                setUserPosts(postsQuerySnapshot.docs);
            }
        } catch (error) {
            console.log(`Não foi possível buscar postagens do usuário: ${error}`)
        }
    }

    function followUser() {
        try {
            const userRef = doc(db, `user/${myUid}/seguindo/${userUid}`);

            function follow() {
                getDoc(userRef)
                    .then((userRefData) => {
                        if (userRefData.exists() && userRefData.data().seguindo == false) {
                            updateDoc(userRef, { seguindo: true });
                        } else {
                            setDoc(userRef, { seguindo: true });
                        }
                    });
            }
            function unFollow() {
                getDoc(userRef)
                    .then((userRefData) => {
                        if (userRefData.exists() && userRefData.data().seguindo == true) {
                            updateDoc(userRef, { seguindo: false });
                        }
                    });
            }

            getDoc(userRef)
                .then((userRefData) => {
                    if (userRefData.exists() && userRefData.data().seguindo == false) {
                        follow();
                    } else if (userRefData.exists() && userRefData.data().seguindo == true) {
                        unFollow();
                    } else {
                        follow();
                    }
                })
        }
        catch (error) {
            console.log(error);
        }
    };

    function noPosts() {
        const phrases = {
            f1: "Parece que a festa ainda não começou 🥳",
            f2: "Este usuário não possui postagens 😥",
            f3: "Aparetemente alguém está usando outra rede social 😅",
            f4: "Veio bisbilhotar e não achou nadakkkkkkkkkkk",
            f5: `Parace que ${username} está sem criatividade pra postar💭`,
            f6: "Algúem precisa encher sua caixa de areia... ⌛",
            f7: `Sim, cada uma dessas frases são diferentes... E ${username} ainda continua sem postagens`,
            f8: "Este usuário é low profile  😶‍🌫️",
            f9: `A última postagem que ${username} fez ainda existia orkut`,
            f10: `${username} é tão discreto nas redes sociais que até o sinal Wi-Fi fica confuso sobre sua existência! 😄📱Ass. Chat GPT`
        }
        var numP = `f${1 + parseInt(Math.random() * 10)}`;
        setPhrases(phrases[numP]);
    }

    return (
        <ScrollView style={styles.profile}>
            <BackHeader changeScreen={handleGoBackScreen} description={"VISUALIZAR PERFIL"}>
                <ProfileHeader
                    myProfile={myProfile}
                    myUid={myUid}
                    userUid={uid}
                    userBanner={userBanner}
                    userPic={userPic}
                    username={username}
                    description={description}
                    email={email}
                    userAuth={userAuth}
                    onPress={() => followUser()}
                />
            </BackHeader>
            <View style={styles.useData}>
                <Image style={styles.userBanner} source={userBanner} />
                <View style={styles.picture}>
                    <Image style={styles.userPic} source={userPic} />
                </View>
                <Text style={styles.username}>
                    {username ? username : ""}
                </Text>
                <Text style={styles.bio}>
                    {description ? `"${description}"` : ""}
                </Text>
                <View style={styles.posts}>
                    <Text style={styles.text}>
                        Posts
                    </Text>
                    {!userPosts ? (
                        <LoadingPosts text={phrases} fontSize={20} />
                    ) : (
                        userPosts.map((post) => (
                            <Post
                                key={post.id}
                                myProfile={myProfile}
                                postId={post.id}
                                userUid={post.data().userUid}
                                usernameFetched={post.data().usuario}
                                textFetched={post.data().texto}
                                imageFetched={post.data().fotoURL}
                                timeFeched={post.data().timestamp}
                                likeCouterFeched={post.data().comment}
                                commentCounterFeched={post.data().like}
                                showInteractions={true}
                                showTime={true}
                                canOpen={true}
                                canDelete={true}
                            />
                        ))
                    )}
                </View>
            </View>
        </ScrollView>
    );
}

