import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignIn from '../screens/signIn';
import SignUp from '../screens/singUp';
import RecoverPassword from '../screens/recoverPassword';
import RecoverySent from '../screens/recoverPassword/recoverySent'
import Feed from '../screens/feed';
import Profile from '../screens/profile';
import UserConfig from '../screens/userConfig';
import CreatePost from '../screens/createPost';
import FullPost from '../screens/fullPost';
import MakeComment from '../screens/makeComment';
import SearchProfile from '../screens/searchProfile';

export default function Routes() {

	const { Navigator, Screen } = createNativeStackNavigator();

	return (
		<NavigationContainer>
			<Navigator
				screenOptions={{
					headerShown: false,
					animation: 'none',
				}}
			>
				{/* <Screen
					name="teste"
					component={Teste}
				/> */}
				<Screen
					options={{
						animation: 'default',
					}}
					name="SingIn"
					component={SignIn}
				/>
				<Screen
					options={{
						animation: 'default',
					}}
					name="SignUp"
					component={SignUp}
					/>
				<Screen
					options={{
						animation: 'default',
					}}
					name="RecoverPassword"
					component={RecoverPassword}
				/>
				<Screen
					name="RecoverySent"
					component={RecoverySent}
				/>
				<Screen
					options={{
						animation: 'default',
					}}
					name="Feed"
					component={Feed}
				/>
				<Screen
					options={{
						animation: 'ios',
					}}
					name="Profile"
					component={Profile}
				/>
				<Screen
					options={{
						animation: 'default',
					}}
					name="UserConfig"
					component={UserConfig}
				/>
				<Screen
					options={{
						animation: 'fade_from_bottom',
					}}
					name="CreatePost"
					component={CreatePost}
				/>
				<Screen
					options={{
						animation: 'default',
					}}
					name="FullPost"
					component={FullPost}
				/>
				<Screen
					options={{
						animation: 'fade_from_bottom',
					}}
					name="MakeComment"
					component={MakeComment}
				/>
				<Screen
					options={{
						animation: 'ios',
					}}
					name="SearchProfile"
					component={SearchProfile}
				/>
			</Navigator>
		</NavigationContainer>
	);
}