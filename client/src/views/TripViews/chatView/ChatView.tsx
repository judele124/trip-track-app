import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuthContext } from '@/contexts/AuthContext';
import { useTripSocket } from '@/contexts/socketContext/SocketContext';
import { IMessage } from '@/contexts/socketContext/types';
import { useTripContext } from '@/contexts/TripContext';
import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

interface FormValues {
	message: string;
}

const ChatView = () => {
	const { trip } = useTripContext();
	const { user } = useAuthContext();
	const { socket, messages, setUnreadMessagesState } = useTripSocket();
	const { register, handleSubmit, reset } = useForm<FormValues>();

	const handleSendMessage: SubmitHandler<FormValues> = ({ message }) => {
		if (!trip || !user || !socket) return;
		socket.emit(
			'sendMessage',
			trip._id.toString(),
			message,
			user._id.toString()
		);
		reset();
	};

	useEffect(() => {
		setUnreadMessagesState({
			count: 0,
			isInChat: true,
		});

		return () => {
			setUnreadMessagesState({
				count: 0,
				isInChat: false,
			});
		};
	}, []);

	return (
		<div className='page-colors relative z-30 flex h-full flex-col'>
			<div className='flex-1 overflow-y-auto px-4 py-2'>
				{messages.map((message, index) => (
					<Message message={message} key={index} userId={user?._id} />
				))}
			</div>

			<form
				className='page-colors flex gap-2 px-4 py-2'
				onSubmit={handleSubmit(handleSendMessage)}
			>
				<Input
					{...register('message', { required: true })}
					type='text'
					title='Message'
					placeholder='Message'
					autoComplete='off'
					containerClassName='w-full'
				/>
				<Button primary type='submit'>
					Send
				</Button>
			</form>
		</div>
	);
};

export default ChatView;

function Message({ message, userId }: { message: IMessage; userId?: string }) {
	return (
		<div
			className={`my-2 w-fit max-w-[80%] rounded-2xl p-3 dark:text-dark ${
				message.userId === userId
					? 'bg-green-200 text-left'
					: 'ml-auto bg-sky-200 text-right'
			}`}
		>
			{message.userId !== userId && (
				<span className='font-semibold'>
					{message.userName || message.userId}
				</span>
			)}
			<div className='flex flex-row items-end gap-2'>
				<span className='text-nowrap text-xs text-gray-500'>
					{message.timestamp}
				</span>
				<p className='grow overflow-hidden break-words'>{message.message}</p>
			</div>
		</div>
	);
}
