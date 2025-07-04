import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useEffect, useState } from 'react';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import useAxios from '@/hooks/useAxios';
import { API_BASE_URL } from '@/env.config';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InputFeildError from '../ui/InputFeildError';
import { Schemas } from 'trip-track-package';
import { useAuthContext } from '@/contexts/AuthContext';

const LOADER_GIF =
	'https://media1.giphy.com/media/3oEjI6SIIHBdRxXI40/200w.gif?cid=6c09b952aui5tunhas7rsybn9vumavkvdfvz88bxyjecfghh&ep=v1_gifs_search&rid=200w.gif&ct=g';

export default function UserInputNameModal({
	setIsOpen,
}: {
	setIsOpen: (isOpen: boolean) => void;
}) {
	const { user, handleTokenValidation } = useAuthContext();
	const { activate, loading } = useAxios<string>({
		manual: true,
	});

	const {
		trigger,
		watch,
		formState: { errors },
		handleSubmit,
		setValue,
	} = useForm<{ name: string }>({
		resolver: zodResolver(
			Schemas.user.pick({
				name: true,
			})
		),
	});

	const [randomNameError, setRandomNameError] = useState<string | null>(null);
	const [inputValue, setInputValue] = useState('');
	const inputValueDebaunced = useDebouncedValue(inputValue, 500);
	const name = watch('name') || '';

	useEffect(() => {
		if (!user) return;

		activate({
			url: `${API_BASE_URL}/user/random-name`,
		}).then(({ data: name }) => name && setInputValue(name));
	}, []);

	useEffect(() => {
		if (!inputValueDebaunced) return;
		setValue('name', inputValueDebaunced);
		trigger('name').then((isValid) => {
			if (!isValid) setValue('name', inputValueDebaunced);
		});
	}, [inputValueDebaunced]);

	const handleGenerateRandomName = async () => {
		const { data: name, error } = await activate({
			url: `${API_BASE_URL}/user/random-name`,
		});

		if (error) {
			setRandomNameError(error.message);
			return;
		}

		if (name) {
			setValue('name', name);
			setInputValue(name);
		}
	};

	const handleUpdateUserOrGuestAvatarInfo = async ({
		name,
	}: {
		name: string;
	}) => {
		if (!user) return;
		const imageUrl = `https://robohash.org/${name}.png`;
		const { role } = user;
		let status;

		if (role === 'guest') {
			const { status: userStatus } = await activate({
				url: '/auth/update-guest-info-token',
				method: 'PUT',
				data: {
					name,
					imageUrl,
				},
			});
			status = userStatus;
		} else if (role === 'user') {
			const { email } = user;
			const { status: userStatus } = await activate({
				url: '/user/profile',
				method: 'PUT',
				data: {
					email,
					role,
					name,
					imageUrl,
				},
			});
			status = userStatus;
		}

		if (status && status >= 200 && status <= 300) {
			await handleTokenValidation();
			setIsOpen(false);
		}
	};

	return (
		<Modal
			containerClassName='page-padding w-[95vw] max-w-[400px]'
			onBackdropClick={() => {}}
			center={true}
			open={true}
		>
			<form
				onSubmit={handleSubmit(handleUpdateUserOrGuestAvatarInfo)}
				className='page-colors flex flex-col justify-center gap-2 rounded-2xl p-5 text-center'
			>
				<h5>This is you</h5>
				<div className='mx-auto size-28 overflow-hidden rounded-full bg-secondary text-center'>
					<img
						className={`size-full`}
						src={!name ? LOADER_GIF : `https://robohash.org/${name}.png`}
					/>
				</div>
				{randomNameError ? <h6>{randomNameError}</h6> : <h6>{name}</h6>}
				<p>see what happens when you type a new name</p>
				{errors.name?.message && (
					<InputFeildError message={errors.name.message} />
				)}
				<Input
					value={inputValue}
					placeholder='Enter name'
					onChange={(e) => setInputValue(e.target.value)}
				/>
				<Button primary disabled={loading} type='submit'>
					Confirm
				</Button>
				<Button type='button' onClick={handleGenerateRandomName}>
					Generate Random Name
				</Button>
			</form>
		</Modal>
	);
}
