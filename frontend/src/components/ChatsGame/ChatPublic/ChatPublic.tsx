import ListFriends, { Players } from "../../Profiles/MiniProfile/ListFriends";
import DinamicProfile from "../../Profiles/DinamicProfile/DinamicProfile";

import { createContext, useContext, useEffect } from "react";
import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { UserData } from "../../InitialPage/Contexts/Contexts";
import bgChatPublic from "../../../assets/game/bgChatPublic.png";
import RightSide from "./RightSide";
import ModalIsBanned from "./ModalIsBanned";

type User = {
	nickname: string,
	avatar: string,
	id: string,
}
export type Messages = {
	id: string,
	content: string,
	date: Date,
	user: User,
}

export type ChatData = {
	id: string,
	name: string,
	photo: string,
	members: Players[],
	banned: Players[],
	kicked: Players[],
	admin: Players[],
	mutted: {id: string}[],
	message: Messages[],
}

type DinamicProfile = {
	nickName: string,
	id: string,
}

export const ChatContext = createContext<{
	chatData: ChatData;
	setDataChat: React.Dispatch<React.SetStateAction<ChatData>>;
	setDinamicProfile: React.Dispatch<React.SetStateAction<DinamicProfile>>;
}>({
	chatData: {} as ChatData,
	setDataChat: () => { },
	setDinamicProfile: () => { }
});


type propsPageChats = {
	openPageChats: React.Dispatch<React.SetStateAction<string>>;
	chatName: string;
}

export default function ChatPublic(props: propsPageChats) {
	const [chatData, setDataChat] = useState<ChatData>({} as ChatData);
	const [dinamicProfile, setDinamicProfile] = useState<DinamicProfile>({} as DinamicProfile);
	const [showDinamicProfile, setShowDinamicProfile] = useState<string>('');
	const userData = useContext(UserData).user;
	const [showModal, setShowModal] = useState<{ show: boolean, msg: String }>({ show: false, msg: "" });

	const createMutedList = (muttedList: any[]) => {
		return muttedList.map((item) => ({ id: item.userId[0].id }))
	}

	function addNewMember(chat_id: String, data: ChatData) {
		data.mutted = createMutedList(data.mutted)
		if (data.members.map((member) => member.nickname).includes(userData.nickname)) {
			return
		} else if (data.banned.map((member) => member.nickname).includes(userData.nickname)) {
			return
		} else if (data.kicked.map((member) => member.nickname).includes(userData.nickname)) {
			return
		}

		let obj = {
			my_id: userData.id,
			other_id: userData.id,
			chat_name: props.chatName,
			chat_id: chat_id,
		}
		userData.socket?.emit("add-member-group", obj);
	}

	//TODO: Show modal when delete chat

	const getDataChat = () => {
		const ENV = `chat_name=${props.chatName}&password=''`
		axios.get(`${process.env.REACT_APP_HOST_URL}/chatroom/find-public/?${ENV}`, {
			headers: {
				Authorization: Cookies.get("jwtToken"),
				"ngrok-skip-browser-warning": "69420",
			}
		}).then((response) => {
			setDataChat(response.data)
			addNewMember(response.data.id, response.data)
			userData.socket?.emit("open-group", { chatId: response.data.id });
		}).catch((error) => {
		})
	}

	useEffect(() => {
		getDataChat()
	}, [])

	useEffect(() => {
		if (dinamicProfile.nickName) {
			setShowDinamicProfile('show');
		}
	}, [dinamicProfile])

	const getIsMyId = (id: String, msg: String) => {
		if (userData.id == id)
			setShowModal({ show: true, msg: msg });
		getDataChat();
	}

	//TODO: verificar se o usuario foi banido e manda ele sair
	//Sockets
	useEffect(() => {
		userData.socket?.on('checkStatus', (data: any) => {
			getDataChat();
		})
		userData.socket?.on('updateChat', (data: any) => {
			getDataChat();
		})

		userData.socket?.on('deleteChat', (message: any) => {
			props.openPageChats("")
			setShowModal({ show: true, msg: message });
		})

		userData.socket?.on('banMember', (obj: any) => {
			getIsMyId(obj.id, obj.msg)
		})

		userData.socket?.on('kickMember', (obj: any) => {
			getIsMyId(obj.id, obj.msg)
		})
		return () => {
			userData.socket?.off('checkStatus')
			userData.socket?.off('updateChat')
			userData.socket?.off('deleteChat')
			userData.socket?.off('banMember')
			userData.socket?.off('kickMember')
		}
	}, [userData.socket])
	//##############################################################

	if (!chatData.name) return <div>Não ha chats</div>

	// https://vetplus.vet.br/wp-content/uploads/2019/12/img_2427.jpg vc foi chutado
	return (
		<div className="rounded text-white
			position-absolute top-50 start-50 translate-middle h-75 w-75"
			style={{ backgroundImage: `url(${bgChatPublic})`, backgroundSize: 'cover' }}
		>
			{showModal.show ? <ModalIsBanned openPageChats={props.openPageChats} msg={showModal.msg} /> : null}
			<div className="row g-0 h-100 p-2">
				<ChatContext.Provider value={{ chatData: chatData, setDataChat, setDinamicProfile }}>
					<div className="col-3 border-end h-100">
						<ListFriends
							players={chatData.members}
							getPlayers={() => { }}
							admin={chatData.admin}
							mute={chatData.mutted}
						/>
					</div>

					<div className="col-9 d-flex flex-column h-100 position-relative">
						<RightSide
							chatName={props.chatName}
							openPageChats={props.openPageChats}
						/>
					</div>
				</ChatContext.Provider>
			</div>


			{!showDinamicProfile ? null :
				<DinamicProfile
					openDinamicProfile={setShowDinamicProfile}
					nickName={dinamicProfile.nickName}
					id={dinamicProfile.id}
				/>
			}
		</div>
	)
}
