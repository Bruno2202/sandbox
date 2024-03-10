import { useState } from "react";
import { TextInput, StyleSheet } from "react-native";

export default function Input({ placeholder, onChangeText, paddingVertical, paddingHorizontal, flex, children, borderRadius, multiline }) {

	const [paddingV, setPaddingV] = useState(paddingVertical ? paddingVertical : 8);
	const [paddingH, setPaddingH] = useState(paddingHorizontal ? paddingHorizontal : 12);
	const [Flex, setFlex] = useState(flex ? flex : 0);

	return (
		<TextInput
			secureTextEntry={false}
			style={{ ...styles.input, paddingVertical: paddingV, paddingHorizontal: paddingH, flex: Flex, borderRadius: borderRadius ? borderRadius : 4}}
			placeholder={placeholder}
			placeholderTextColor="#FFFFFF"
			onChangeText={onChangeText}
			multiline={multiline}
		/>
	);
}

const styles = StyleSheet.create({
	input: {
		fontFamily: 'KantumruyProMedium',
		color: '#FFFFFF',
		backgroundColor: '#696969',
		width: '100%',
		paddingVertical: 8,
		paddingHorizontal: 12,
	},
});
