import React from 'react';
import { Appearance } from 'react-native';


type ThemeContextType = { dark: boolean; toggle: () => void };
const ThemeContext = React.createContext<ThemeContextType>({ dark: false, toggle: () => {} });


export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const colorScheme = Appearance.getColorScheme();
	const [dark, setDark] = React.useState(colorScheme === 'dark');
	const toggle = () => setDark((v) => !v);
	return <ThemeContext.Provider value={{ dark, toggle }}>{children}</ThemeContext.Provider>;
};


export default ThemeContext;