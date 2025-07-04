import { createContext, useContext, useEffect, useState } from 'react';
import useAxios from '../hooks/useAxios';
import {
	logout,
	sendCode,
	validateToken,
	verifyCode,
} from '../servises/authService';
import { useLocation } from 'react-router-dom';
import { Types } from 'trip-track-package';
import { ServiceError } from '@/utils/ServiceError';
import { navigationRoutes } from '@/Routes/routes';
import { IUserResponseData } from '@/types/user';

interface AuthProviderProps {
	children: React.ReactNode;
}

interface IAuthContextValue {
	handleTokenValidation: () => Promise<void>;
	logout: () => Promise<void>;
	sendCode: (email: string) => Promise<void>;
	verifyCode: (data: Types['Auth']['LoginSchema']) => Promise<void>;
	loading: boolean;
	status: number | undefined;
	tokenValidationStatus: number | null;
	sendCodeError: Error | null;
	verifyCodeError: Error | null;
	logoutError: Error | null;
	sendCodeStatus: number | undefined;
	verifyCodeStatus: number | undefined;
	logoutStatus: number | undefined;
	user: IUserResponseData | null;
}

const AuthContext = createContext<null | IAuthContextValue>(null);

export default function AuthProvider({ children }: AuthProviderProps) {
	const { pathname } = useLocation();
	const [sendCodeError, setSendCodeError] = useState<Error | null>(null);
	const [verifyCodeError, setVerifyCodeError] = useState<Error | null>(null);
	useState<Error | null>(null);
	const [tokenValidationStatus, setTokenValidationStatus] = useState<
		number | null
	>(null);
	const [sendCodeStatus, setSendCodeStatus] = useState<number | undefined>();
	const [verifyCodeStatus, setVerifyCodeStatus] = useState<
		number | undefined
	>();
	const [user, setUser] = useState<IUserResponseData | null>(null);
	const { activate, loading, error, status } = useAxios({ manual: true });

	const handleSendCode = async (email: string) => {
		try {
			const { status } = await sendCode(email, activate);
			setSendCodeError(null);
			setSendCodeStatus(status);
		} catch (err: any) {
			setSendCodeError(err);
			setSendCodeStatus(undefined);
			throw err;
		}
	};

	const handleVerifyCode = async (data: Types['Auth']['VerifyCode']) => {
		try {
			const { user, status } = await verifyCode(data, activate);
			setVerifyCodeStatus(status);
			setUser(user);
			setVerifyCodeError(null);
		} catch (err: any) {
			setVerifyCodeError(err);
			setVerifyCodeStatus(undefined);
			console.error(err);
		}
	};

	const handleLogout = async () => {
		try {
			await logout(activate);
			setUser(null);
		} catch (err: any) {
			setVerifyCodeError(err);
			setVerifyCodeStatus(undefined);
			throw err;
		}
	};

	const handleTokenValidation = async () => {
		try {
			const { user, status } = await validateToken(activate);
			setUser(user);
			setTokenValidationStatus(status);
		} catch (err) {
			setTokenValidationStatus((err as ServiceError).statusCode);
			console.error(err);
		}
	};

	useEffect(() => {
		if (pathname.includes(navigationRoutes.firstEntry)) return;

		handleTokenValidation();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				handleTokenValidation,
				sendCode: handleSendCode,
				verifyCode: handleVerifyCode,
				logout: handleLogout,
				loading,
				tokenValidationStatus,
				status,
				sendCodeError,
				verifyCodeError,
				logoutError: error,
				logoutStatus: status,
				sendCodeStatus,
				verifyCodeStatus,
				user,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuthContext = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuthContext must be used within a AuthProvider');
	}
	return context;
};
