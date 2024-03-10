import { TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { getAuth, signOut } from 'firebase/auth';

export default function LogOut() {

    const navigation = useNavigation();
    function handleSignInScreen() {
        navigation.navigate('SingIn', {});
    }

    async function logout() {
        try {
            await signOut(getAuth());
            handleSignInScreen();
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <TouchableOpacity onPress={logout}>
            <MaterialIcons name="logout" size={24} color="#A01212" />
        </TouchableOpacity>
    );
}
