import { Text, View, Image, StatusBar } from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { sendPasswordResetEmail, getAuth } from "firebase/auth";

import styles from "./style";
import Toast from "react-native-toast-message";
import Input from "../../components/inputs/Input";
import AppButton from "../../components/AppButton";
import BackHeader from "../../components/BackHeader";

export default function RecoverPassword() {

    const [email, setEmail] = useState("");

	const statusBarHeight = StatusBar.currentHeight ? 10 : 50;

    function validateFields() {
        if (email === "") {
            Toast.show({
                type: 'error',
                text1: 'Me ajude a te ajudar 🥺',
                text2: 'Informe o email referente a sua conta',
            });
        } else {
            sendRecoveryEmail();
        }
    }

    const sendRecoveryEmail = () => {
        sendPasswordResetEmail(getAuth(), email)
            .then(() => {
                recoverySentScreen()
            })
            .catch((error) => {
                Toast.show({
                    type: 'error',
                    text1: 'Não foi possível requisitar alteração de senha 😥',
                    text2: 'Verifique os campos ou tente novamente mais tarde'
                });
                console.log(`Erro ao requisitar senha: ${error}`)
            });
    }

    const navigation = useNavigation();
    function handleSingInScreen() {
        navigation.navigate("SingIn", {});
    }
    function recoverySentScreen() {
        navigation.navigate("RecoverySent", {});
    }

    return (
        <View style={{ backgroundColor: '#2C2C2C', flex: 1, paddingTop: statusBarHeight }}>
            <BackHeader backgroundColor={"#2C2C2C"} changeScreen={() => handleSingInScreen()}/>
            <View style={styles.recoverPassword}>
                <View style={styles.pageContent}>
                    <Image style={styles.logo} source={require('../../assets/img/logo.png')}></Image>
                    <Text style={styles.pageTitle}>
                        Recuperar senha
                    </Text>
                    <Text style={styles.text}>
                        Tu é burro? Vê se anota a senha dessa vez...
                    </Text>
                    <View style={styles.forms}>
                        <View style={styles.formsInputs}>
                            <Input placeholder={"Email"} onChangeText={setEmail} />
                        </View>
                    </View>
                    <AppButton text={"Verificar email"} onPress={validateFields} />
                </View>
            </View>
        </View>
    );
}