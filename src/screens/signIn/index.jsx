import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import Toast from "react-native-toast-message";

import { signInWithEmailAndPassword, onAuthStateChanged, getAuth } from "firebase/auth";

import styles from "./style";
import Input from "../../components/inputs/Input";
import PasswordInput from "../../components/inputs/PasswordInput";
import AppButton from "../../components/AppButton";

export default function SignIn() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigation = useNavigation();
    function handleSingUpScreen() {
        navigation.navigate("SignUp", {});
    }
    function handleRecoverPasswordScreen() {
        navigation.navigate("RecoverPassword", {});
    }
    function feedScreen() {
        navigation.navigate("Feed", {});
    }

    useEffect(() => {
        onAuthStateChanged(getAuth(), (user) => {
            if (user) {
                navigation.navigate("Feed", {});
            }
        });
    }, []);

    function validateFields() {
        if (email === "" || password === "") {
            Toast.show({
                type: 'error',
                text1: 'Erro ao logar 😥',
                text2: 'Verifique os dados informados'
            });
        } else {
            tryLogin();
        }
    }

    const tryLogin = () => {
        signInWithEmailAndPassword(getAuth(), email, password)
            .then((userCredential) => {
                feedScreen();
            })

            .catch((error) => {
                Toast.show({
                    type: 'error',
                    text1: 'Erro ao logar',
                    text2: 'Dados do usuário estão incorretos'
                });
                console.log(`Erro ao tentar logar: ${error}`)
            });
    }

    return (
        <View style={styles.signIn}>
            <View style={styles.pageContent}>
                <Image style={styles.logo} source={require('../../assets/img/logo.png')}></Image>
                <Text style={styles.appTitle}>
                    Sandbox
                </Text>
                <View style={styles.forms}>
                    <View style={styles.formsInputs}>
                        <Input placeholder={"Email"} onChangeText={setEmail} />
                        <PasswordInput placeholder={"Senha"} onChangeText={setPassword} />
                    </View>
                    <View style={styles.createAccArea}>
                        <TouchableOpacity style={styles.createAcc} onPress={handleSingUpScreen}>
                            <Text style={styles.createAccText} >
                                Criar conta
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <AppButton text={"Entrar"} onPress={validateFields} />
                <TouchableOpacity onPress={handleRecoverPasswordScreen}>
                    <Text style={styles.forgotAccText}>
                        Esqueci a senha
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
