import { View, FlatList } from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { db, storage } from '../../../firebaseConfig';
import { collection, getDocs, where } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";

import styles from "./style";
import BackHeader from "../../components/BackHeader";
import SearchInput from "../../components/inputs/SearchInput";
import LoadingPosts from '../../components/post/LoadingPosts'
import MiniProfile from "../../components/MiniProfile";

export default function SearchProfile() {

    const [text, setText] = useState("");
    const [typing, setTyping] = useState(false);
    const [data, setData] = useState([]);
    const [fetchedProfiles, setFetchedProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [phrases, setPhrases] = useState("");

    useEffect(() => {
        loadingPhrases();
        fetchProfiles();
    }, []);

    useEffect(() => {
        setFetchedProfiles(data);
    }, [data]);

    const navigation = useNavigation();
    function handleFeedScreen() {
        navigation.navigate("Feed", {})
    }

    function isTyping(e) {
        setText(e);
        if (e !== "") {
            handleFetchProfile(e);
            setTyping(true);
        } else {
            setTyping(false);
            setFetchedProfiles(data);
        }
    }

    async function fetchProfiles() {
        try {
            const profilesQuerySnapshot = await getDocs(collection(db, 'user'));

            const profilesData = await Promise.all(profilesQuerySnapshot.docs.map(async (doc) => {
                const user = doc.data();
                const uid = doc.id
                const userPic = await fetchProfilePic(doc.id);
                return { ...user, userPic, uid };
            }));

            setData(profilesData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching profiles:', error);
            setLoading(false);
        }
    }

    async function fetchProfilePic(uid) {
        const storageRefUserPic = ref(storage, `${uid}/UserPic`);
        const storageRefDefaultUserPic = ref(storage, `defaultImages/userPic.png`);

        try {
            const url = await getDownloadURL(storageRefUserPic);
            return { uri: url };
        } catch (error) {
            try {
                const url = await getDownloadURL(storageRefDefaultUserPic);
                return { uri: url };
            } catch (error) {
                if (error.code !== 'storage/object-not-found') {
                    console.log(`Não foi possível carregar a imagem do usuário: ${error}`);
                }
                return null;
            }
        }
    }

    function loadingPhrases() {
        const phrases = {
            f1: "Aguarde enquanto o desenvolvedor tira a foto de cada usuário... 📸👨‍💻",
            f2: "Aguarde enquanto nossa carroça de servidor transporta os usuários... 🚚",
            f3: "Aguarde enquanto os usuários estão sendo carregados... ⏳💤",
            f4: "Tome uma xícara de café enquanto os usuários estão sendo carregados... ☕",
            f5: "Enquanto não temos o servidor da Google, aguarde enquanto os usuários estão sendo carregados... 🌐",
            f6: "Pera aí, estou carregando os usuários... ⏳👨‍💻",
            f7: "Aguarde enquanto o servidor carrega tanto usuário feio kkkkkkkkj",
            f8: "Você demorou 9 meses para nascer. Acredito que você consegue esperar um pouco enquanto os usuários carregam... 🍼",
            f9: "Enquanto aguardamos, você já verificou se há alguma atualização no Sandbox? 🕵️‍♂️🔄",
            f10: "Fato curioso:\nAntes da rede social se chamar 'Sandbox', ela se chamava 'caixa de areia'.\nAté hoje, na versão web, a URL do site permanece como 'caixa-de-areia-2' devido a um erro de planejamento..."
        }
        var numP = `f${1 + parseInt(Math.random() * 10)}`;
        setPhrases(phrases[numP]);
    }

    function handleFetchProfile(text) {
        var matchProfileIndex = [];
        var matchProfile = [];
        for (var i=0 ; i < data.length ; i++) {
            var userWords, nameFetched = (data[i].usuario);
            for (var j=0 ; j<text.length ; j++) {
                if (nameFetched[j] !== undefined) {
                    userWords = userWords + nameFetched[j];
                }
            }
            if (text.toUpperCase() == userWords.toUpperCase()) {
                if (!matchProfileIndex.includes(i)) {
                    matchProfileIndex.push(i);
                }
            }
            userWords = "";
        }
        for (var k=0 ; k < matchProfileIndex.length ; k++) {
            matchProfile.push(data[matchProfileIndex[k]]);
        }
        setFetchedProfiles(matchProfile);
    }

    return (
        <>
            <BackHeader changeScreen={handleFeedScreen}>
                <SearchInput
                    placeholder={"Pesquisar"}
                    paddingVertical={4}
                    paddingHorizontal={4}
                    flex={1}
                    onChangeText={(e) => isTyping(e)}
                    setTyping={setTyping}
                    typing={typing}
                    setText={setText}
                    text={text}
                />
            </BackHeader>
            <View style={styles.searchProfile}>
                {loading ? (
                    <LoadingPosts text={phrases} />
                ) : (
                    <FlatList
                        data={fetchedProfiles}
                        renderItem={({ item }) => (
                            <View style={{ alignItems: 'center' }}>
                                <MiniProfile
                                    key={item.uid}
                                    uid={item.uid}
                                    username={item.usuario}
                                    userPic={item.userPic ? item.userPic : { uri: require('../../assets/img/userPic.png') }}
                                />
                            </View>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                    />
                )}
            </View>
        </>
    );
}
