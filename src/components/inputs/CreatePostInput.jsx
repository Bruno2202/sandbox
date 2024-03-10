import { StyleSheet, TextInput, View, Image, TouchableOpacity, Modal, Pressable, Keyboard } from "react-native";
import React, { useState, useEffect } from "react";
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { onAuthStateChanged, getAuth } from "firebase/auth";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../../firebaseConfig";

export default function CreatePostInput({ setText, image, setImage, placeholder, allowsPhotos, marginHorizontal, children, marginTop }) {

	const [userPic, setUserPic] = useState(null);
	const [uid, setUid] = useState(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [placeholderInput, setPlaceholderInput] = useState(placeholder ? placeholder : "O que está acontecendo dentro dessa caixa?");

	useEffect(() => {
		onAuthStateChanged(getAuth(), (user) => {
			if (user) {
				const uid = user.uid;
				setUid(uid);
				const storageRef = ref(storage, `${uid}/UserPic`);

				getDownloadURL(storageRef)
					.then((url) => {
						setUserPic({ uri: url })
					})
					.catch((error) => {
						setUserPic(require('../../assets/img/userPic.png'))
						// console.error("Erro ao carregar imagem do usuário:", error);
					});
			}
		});
	}, []);

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			// aspect: [4, 3],
			quality: 0.7,
		});

		if (!result.canceled) {
			setImage(result.assets[0].uri);
		}
	};

	return (
		<View style={{...styles.inputContainer, marginHorizontal: marginHorizontal ? marginHorizontal : 20, marginTop: marginTop ? marginTop : 12}}>
			<View style={styles.inputContent}>
				<Image style={styles.userPic} source={userPic} />
				<TextInput
					placeholder={placeholderInput}
					style={styles.textArea}
					placeholderTextColor="#848484"
					multiline={true}
					maxLength={500}
					onChangeText={setText}
				/>
			</View>
			{allowsPhotos && (
				<View style={styles.inputFooter}>
					<TouchableOpacity style={styles.photo} onPress={pickImage}>
						<FontAwesome name="camera" size={16} color="#FFFFFF" />
					</TouchableOpacity>
				</View>
			)}
			<View style={styles.pickedImageContent}>
				<Modal
					animationType="none"
					transparent={true}
					visible={modalVisible}
					onRequestClose={() => {
						setModalVisible(!modalVisible);
					}}>
					<Pressable style={styles.openImage} onPress={() => setModalVisible(!modalVisible)}>
						<TouchableOpacity style={styles.closeImage} onPress={() => setModalVisible(!modalVisible)}>
							<AntDesign name="close" size={32} color="#FFFFFF" />
						</TouchableOpacity>
						<Image source={{ uri: image }} style={styles.imageFullSize} />
					</Pressable>
				</Modal>
				{image &&
					<TouchableOpacity onPress={() => setModalVisible(true)}>
						<Image source={{ uri: image }} style={styles.pickedImage} />
					</TouchableOpacity>
				}
			</View>
			{children && (
				<View style={styles.children}>
					{children}
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	inputContainer: {
		backgroundColor: '#3D3D3D',
		padding: 4,
		borderRadius: 4,
	},
	inputContent: {
		flexDirection: 'row',
		backgroundColor: '#3D3D3D',
		height: 'auto',
	},
	userPic: {
		resizeMode: 'contain',
		width: 40,
		height: 40,
		borderRadius: 50,
	},
	textArea: {
		flex: 1,
		color: '#FFFFFF',
		marginHorizontal: 8,
		fontFamily: 'KantumruyProRegular',
		backgroundColor: '#3D3D3D',
		height: 'auto',
	},
	inputFooter: {
		alignItems: 'flex-end',
		height: 'auto',
	},
	photo: {
		justifyContent: 'center',
		alignItems: 'center',
		padding: 4,
		height: 30,
		width: 30,
		borderRadius: 50,
		backgroundColor: '#0060CE',
		margin: 4,
	},
	pickedImageContent: {

	},
	pickedImage: {
		aspectRatio: 1,
		resizeMode: 'cover',
		width: 50,
		borderRadius: 4,
	},
	openImage: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,1)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	closeImage: {
		justifyContent: 'flex-end',
		position: 'absolute',
		right: 12,
		top: 12,
		zIndex: 1,
	},
	imageFullSize: {
		resizeMode: 'contain',
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		aspectRatio: 1,
		width: '100%',
	},
	children: {
		alignItems: 'flex-end',
	},
});