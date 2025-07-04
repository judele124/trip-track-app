import LoginForm from './components/LoginForm';
import ImageLightDark from '@/components/ui/ImageLightDark';
import loginImgLight from './assets/loginImgLight.svg';
import loginImgDark from './assets/loginImgDark.svg';

const LoginView = () => {
	return (
		<div className='flex h-full flex-col items-center gap-4 overflow-hidden'>
			<h1>Login</h1>
			<LoginForm />
			<ImageLightDark
				className='mx-auto max-w-[400px] grow overflow-hidden object-contain'
				srcDark={loginImgDark}
				srcLight={loginImgLight}
			/>
		</div>
	);
};

export default LoginView;
