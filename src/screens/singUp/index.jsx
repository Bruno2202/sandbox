import { View, Text, Image, TouchableOpacity, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from "react";
import Toast from "react-native-toast-message";

import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { collection, doc, setDoc, } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

import styles from "./style";
import Input from "../../components/inputs/Input";
import PasswordInput from "../../components/inputs/PasswordInput";
import AppButton from "../../components/AppButton";
import BackHeader from "../../components/BackHeader"

export default function SignUp() {

	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const statusBarHeight = StatusBar.currentHeight ? 10 : 50;

	const navigation = useNavigation();
	function handleSingInScreen() {
		navigation.navigate("SingIn", {});
	}

	function validateFieds() {
		if (!username || !email || !password || !confirmPassword) {
			Toast.show({
				type: 'error',
				text1: 'Erro ao tentar cadastrar usuário',
				text2: 'Verifique os campos'
			});
		} else {
			validatePasswords();
		}
	}

	function validatePasswords() {
		if (password !== confirmPassword) {
			Toast.show({
				type: 'error',
				text1: 'Senhas não são iguais',
				text2: 'Verifique as senhas informadas'
			});
		} else {
			registerUser();
		}
	}

	async function registerUser() {
		try {
			const userCredential = await createUserWithEmailAndPassword(getAuth(), email, password);
			const uid = userCredential.user.uid;
			const userCollectionRef = collection(db, "user");
			const dynamicDocumentId = uid;
			const userDocRef = doc(userCollectionRef, dynamicDocumentId);

			const data = new Date;
			const userData = {
				email: email,
				usuario: username,
				descrição: "",
				dt_criação: data
			}

			await setDoc(userDocRef, userData);

			const likedDocRef = doc(db, `user/${uid}/likedPosts/postReference`);
			await setDoc(likedDocRef, { liked: false });

			const followingMe = doc(db, `user/${uid}/seguindo/${uid}`);
			await setDoc(followingMe, { seguindo: true });
		}
		catch (error) {
			if (error == "FirebaseError: Firebase: Error (auth/invalid-email).") {
				Toast.show({
					type: 'error',
					text1: 'Erro ao tentar cadastrar usuário',
					text2: 'O email inserido é inválido'
				});
			}
			if (error == "FirebaseError: Firebase: Password should be at least 6 characters (auth/weak-password).") {
				Toast.show({
					type: 'error',
					text1: 'Erro ao tentar cadastrar usuário',
					text2: 'A senha deve conter 6 ou mais caracteres'
				});
			}
			console.log("Erro no registro do usuário: ", error);
		}
	}

	return (
		<View style={{ backgroundColor: '#2C2C2C', flex: 1, paddingTop: statusBarHeight }}>
			<BackHeader backgroundColor={"#2C2C2C"} changeScreen={() => handleSingInScreen()} />
			<View style={styles.signUp}>
				<View style={styles.pageContent}>
					<Image style={styles.logo} source={require('../../assets/img/logo.png')}></Image>
					<Text style={styles.pageTitle}>
						Cadastre-se
					</Text>
					<View style={styles.forms}>
						<View style={styles.formsInputs}>
							<Input placeholder={"Nome de usuário"} onChangeText={setUsername} />
							<Input placeholder={"Email"} onChangeText={setEmail} />
							<PasswordInput placeholder={"Senha"} onChangeText={setPassword} />
							<PasswordInput placeholder={"Confirmar senha"} onChangeText={setConfirmPassword} />
						</View>
						<View style={styles.haveAccArea}>
							<TouchableOpacity onPress={handleSingInScreen}>
								<Text style={styles.haveAcc} >
									Já possuo uma conta
								</Text>
							</TouchableOpacity>
						</View>
					</View>
					<AppButton text={"Criar conta"} onPress={validateFieds} />
				</View>
			</View>
		</View>
	);
}