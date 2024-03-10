import { StatusBar, FlatList, View } from "react-native";
import { useState, useCallback, useEffect, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import * as Updates from 'expo-updates';

import { collection, query, getDocs, orderBy, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { db } from "../../../firebaseConfig";

import styles from "./style";
import FeedHeader from "../../components/feed/FeedHeader";
import FeedFooter from "../../components/feed/FeedFooter";
import Post from "../../components/post/Post";
import LoadingPosts from "../../components/post/LoadingPosts";
import FeedPostsFooter from "../../components/FeedPostsFooter";

export default function Feed() {

    const [data, setData] = useState([]);
    const [myUid, setMyUid] = useState(null);
    const [forceUpdate, setForceUpdate] = useState(false);
    const [haveUpdate, setHaveUpdate] = useState(false);

    const flatListRef = useRef(null);

    useFocusEffect(useCallback(() => {
        fetchPosts();
        handleReload();
    }, []));

    useEffect(() => {
        checkUpdates();
    }, [])

    const scrollToTop = () => {
        if (flatListRef.current) {
            flatListRef.current.scrollToOffset({ offset: 0, animated: true });
        }
    };

    const handleReload = () => {
        setForceUpdate(prevState => !prevState);
    };

    async function checkUpdates() {
        try {
            const update = await Updates.checkForUpdateAsync();

            if (update.isAvailable) {
                setHaveUpdate(true);
            }
        } catch (error) {
            // console.error('Erro ao verificar atualizações:', error);
        }
    };

    async function fetchPosts() {
        onAuthStateChanged(getAuth(), async (user) => {
            setMyUid(user.uid)
            const followedUsers = await getDocs(collection(db, `user/${user.uid}/seguindo`));
            const usersArray = [];

            followedUsers.forEach((userDoc) => {
                if (userDoc.data().seguindo === true) {
                    usersArray.push(userDoc.id);
                }
            });

            const postsQuerySnapshot = await getDocs(
                query(
                    collection(db, 'posts'),
                    where('userUid', 'in', usersArray),
                    orderBy('timestamp', 'desc')
                )
            );

            const postsData = postsQuerySnapshot.docs.map(doc => doc.data());
            setData([...postsData, { isFooter: true }]);
        });
    };

    return (
        <>
            <StatusBar backgroundColor={"#1E1D1D"} />
            <FeedHeader forceUpdate={forceUpdate} haveUpdate={haveUpdate} setHaveUpdate={setHaveUpdate} fetchPosts={() => fetchPosts()} />
            <View style={styles.feed}>
                <View style={styles.posts}>
                    {data.length === 0 ? (
                        <LoadingPosts />
                    ) : (
                        <FlatList
                            ref={flatListRef}
                            style={styles.postsContent}
                            data={data}
                            renderItem={({ item }) => {
                                if (item.isFooter) {
                                    return <FeedPostsFooter />;
                                } else {
                                    return (
                                        <Post
                                            key={item.postId}
                                            postId={item.postId}
                                            myProfile={myUid === item.userUid ? true : false}
                                            userUid={item.userUid}
                                            textFetched={item.texto}
                                            imageFetched={item.fotoURL}
                                            timeFeched={item.timestamp}
                                            likeCouterFeched={item.comment}
                                            commentCounterFeched={item.like}
                                            showInteractions={true}
                                            showTime={true}
                                            canOpen={true}
                                            canDelete={true}
                                            postType={'post'}
                                        />
                                    );
                                }
                            }}
                            keyExtractor={(item) => (item.isFooter ? 'footer' : item.postId)}
                        />
                    )}
                </View>
            </View>
            <FeedFooter myUid={myUid} onPress={scrollToTop} />
        </>
    );
};
