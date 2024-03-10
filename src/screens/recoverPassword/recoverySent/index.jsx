import { Text, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styles from './styles';
import AppButton from '../../../components/AppButton';


export default function RecoverySent() {

    const navigation = useNavigation();
    function handleSingInScreen() {
        navigation.navigate("SingIn", {});
    }

    return (
        <View style={styles.recoverySent}>
            <View style={styles.pageContent}>
                <Text style={styles.pageTitle}>
                    Link de recuperação enviado!
                </Text>
                <Text style={styles.text}>
                    Verifique a caixa de entrada, o spam ou o lixo eletrônico do email cadastrado e redefina sua senha.
                </Text>
                <View style={styles.loginBtn}>
                    <AppButton text={"Fazer login"} onPress={handleSingInScreen}/>
                </View>
            </View>
            <Image style={styles.logo} source={require('../../../assets/img/logo.png')}></Image>
        </View>
    );
}
