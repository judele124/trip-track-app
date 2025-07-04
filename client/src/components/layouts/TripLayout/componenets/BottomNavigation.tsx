import BottomNavigationBtn from '@/components/ui/BottomNavigationBtn';
import { useTripSocket } from '@/contexts/socketContext/SocketContext';

export default function BottomNavigation({
	setRef,
}: {
	setRef?: (ref: HTMLDivElement) => void;
}) {
	return (
		<div
			ref={(node) => {
				if (node) {
					setRef?.(node);
				}
			}}
			className='page-colors flex flex-row justify-around border-t-2 border-primary p-2'
		>
			<BottomNavigationBtn to='participants' />
			<BottomNavigationBtn to='map' />
			<ChatBtn />
		</div>
	);
}

function ChatBtn() {
	const { unreadMessagesState } = useTripSocket();

	return (
		<BottomNavigationBtn
			to='chat'
			notificationCount={unreadMessagesState.count}
		/>
	);
}
