import { createContext, useContext, useEffect, useState } from 'react';

interface IDarkModeContext {
	isDarkMode: boolean;
	toggleDarkMode: () => void;
}

interface IDarkModeContextProviderProps {
	children?: React.ReactNode;
}

const darkModeContext = createContext<IDarkModeContext>({
	isDarkMode: false,
	toggleDarkMode: () => {},
});

const DarkModeContextProvider = ({
	children,
}: IDarkModeContextProviderProps) => {
	const [isDarkMode, setDarkMode] = useState(initialDarkMode());

	const toggleDarkMode = () => {
		setDarkMode((prev) => !prev);
	};

	useEffect(() => {
		document.getElementById('root')?.classList.toggle('dark', isDarkMode);
		localStorage.setItem('isDarkMode', `${isDarkMode}`);
	}, [isDarkMode]);
	return (
		<darkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
			{children}
		</darkModeContext.Provider>
	);
};

export const useDarkMode = () => {
	return useContext(darkModeContext);
};

export default DarkModeContextProvider;

const initialDarkMode = (): boolean => {
	const localStorageDarkMode = localStorage.getItem('isDarkMode');
	if (localStorageDarkMode) {
		return localStorageDarkMode === 'true';
	}

	if (typeof window !== 'undefined') {
		return window.matchMedia('(prefers-color-scheme: dark)').matches;
	}

	return false;
};
