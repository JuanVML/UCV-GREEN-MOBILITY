import { useFonts } from 'expo-font';

export const useCustomFonts = () => {
  const [fontsLoaded] = useFonts({
    'Outfit-Medium': require('../../assets/fonts/Outfit-Medium.ttf'),
    'Mooli-Regular': require('../../assets/fonts/Mooli-Regular.ttf'),
  });

  return fontsLoaded;
};