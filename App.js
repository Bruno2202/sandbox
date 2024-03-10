import { StatusBar } from 'expo-status-bar';
import { useFonts } from "expo-font";
import { View } from 'react-native';
import Toast from 'react-native-toast-message';

import Routes from './src/routes/Routes';

export default function App() {

  const [fontsLoaded] = useFonts({
    'KantumruyProBold': require('./src/assets/fonts/Kantumruy Pro/KantumruyPro-Bold.ttf'),
    'KantumruyProSemiBold': require('./src/assets/fonts/Kantumruy Pro/KantumruyPro-SemiBold.ttf'),
    'KantumruyProMedium': require('./src/assets/fonts/Kantumruy Pro/KantumruyPro-Medium.ttf'),
    'KantumruyProRegular': require('./src/assets/fonts/Kantumruy Pro/KantumruyPro-Regular.ttf'),
    'KantumruyProLight': require('./src/assets/fonts/Kantumruy Pro/KantumruyPro-Light.ttf'),
    'KantumruyProExtraLight': require('./src/assets/fonts/Kantumruy Pro/KantumruyPro-ExtraLight.ttf'),
    'KantumruyProThin': require('./src/assets/fonts/Kantumruy Pro/KantumruyPro-Thin.ttf'),
    'KantumruyProMediumItalic': require('./src/assets/fonts/Kantumruy Pro/KantumruyPro-MediumItalic.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{flex: 1, backgroundColor: '#2C2C2C'}}>
      <StatusBar
        animated={true}
        translucent={false}
        backgroundColor={'#2C2C2C'}
        style="light"
      />
      <Routes />
      <Toast />
    </View>
  );
}