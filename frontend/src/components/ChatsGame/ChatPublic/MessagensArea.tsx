import  { useContext, useEffect, useState } from "react";
import { ChatContext, Messages } from "./ChatPublic";
import InputChats from "../InputChats";
import { UserData } from '../../InitialPage/Contexts/Contexts';
import FormatMessages from "../FormatMessagens/FormatMessagens";
import { Socket } from "socket.io-client";

export default function MessagensArea(): JSX.Element {
	const { chatData: {id, message, name} } = useContext(ChatContext);

	const [messages, setMessages] = useState<Messages[]>(message);
	const userData = useContext(UserData).user;

	useEffect(() => {
		userData.socket?.on('chatMessage', (data: any) => {
			try {
				data = JSON.parse(data) as Messages;
				setMessages((prevMessagens) => [...prevMessagens, data]);
			} catch (error) {
			}
		});
		return () => {
			userData.socket?.emit('close-group', {chatId: id});
			userData.socket?.off('chatMessage');
		}
	}, [userData.socket]);

	let obj = {
		chatId: id,
		user_id: userData.id,
		content: '',
		route: 'group-message',
		chat_name: name,
	}
	//TODO: adicionar logica de mostrar o erro
	return (
		<>
			<FormatMessages messagens={messages}
				user={userData}
				messageErr={""}
			/>
			<InputChats
				socket={userData.socket as Socket}
				obj={obj}
				disable={false}
			/>
		</>
	)
}
