import { TouchableOpacity } from "react-native"
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";

import FollowingIcon from "./FollowingIcon";

export default function ProfileHeader({ myProfile, myUid, userUid, userBanner, userPic, username, description, email, userAuth, onPress }) {

    const [myProfilePersist, setMyProfilePersist] = useState(null);

    useEffect(() => {
        setMyProfilePersist(myProfile);
    }, [myProfile])

    const navigation = useNavigation();
    function handleConfigScreen() {
        navigation.navigate('UserConfig', { myProfilePersist, userBanner, userPic, username, description, email, myUid, userAuth });
    }

    return (
        myProfilePersist !== null && (
            myProfile ? (
                <TouchableOpacity onPress={handleConfigScreen}>
                    <MaterialIcons name="settings" size={24} color="#FFFFFF" />
                </TouchableOpacity >
            ) : (
                <TouchableOpacity onPress={onPress}>
                    <FollowingIcon myUid={myUid} userUid={userUid} />
                </TouchableOpacity >
            )
        )
    );
};
