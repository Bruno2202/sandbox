import { useEffect, useState } from "react";
import { FontAwesome5 } from '@expo/vector-icons';

import { getDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function FollowingIcon({ myUid, userUid }) {

    const [following, setFollowing] = useState(null);

    useEffect(() => {
        const userFollowing = doc(db, `user/${myUid}/seguindo/${userUid}`);
        const unsubscribeFollow = onSnapshot(userFollowing, (doc) => {
            if (doc.exists()) {
                setFollowing(doc.data().seguindo);
            }
        });

        return () => {
            unsubscribeFollow();
        };
    }, [myUid, userUid])

    return (
        < >
            {following ? <FontAwesome5 name="user-minus" size={24} color="#A01212" /> : <FontAwesome5 name="user-plus" size={24} color="#0060CE" />}
        </>
    );
}
