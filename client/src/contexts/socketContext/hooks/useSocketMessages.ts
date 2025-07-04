import { useState } from 'react';
import { IMessage } from '../types';

export type UnreadMessagesStateType = {
	count: number;
	isInChat: boolean;
};

interface IUseSocketMessagesValue {
	addMsgToMsgs: (message: IMessage) => void;
	messages: IMessage[];
	unreadMessagesState: UnreadMessagesStateType;
	setUnreadMessagesState: (state: UnreadMessagesStateType) => void;
}

export default function useSocketMessages(): IUseSocketMessagesValue {
	const [messages, setMessages] = useState<IMessage[]>([]);
	const [unreadMessagesState, setUnreadMessagesState] =
		useState<UnreadMessagesStateType>({
			count: 0,
			isInChat: false,
		});

	const addMsgToMsgs = (message: IMessage) => {
		setMessages((prev) => [...prev, message]);
		setUnreadMessagesState((prev) => ({
			...prev,
			count: prev.isInChat ? 0 : prev.count + 1,
		}));
	};

	return {
		messages,
		addMsgToMsgs,
		unreadMessagesState,
		setUnreadMessagesState,
	};
}
