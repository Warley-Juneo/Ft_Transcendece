import { BiSolidLock } from 'react-icons/bi';
import { t_chat } from './PublicChats';
import { ReactElement, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import Cookies from 'js-cookie';
import BannedWarningModal from './BannedWarningModal';

type propsChatList = {
	listChats: t_chat[];
	clickedChat: (chatName: string) => void;
}

export default function ChatList(props: propsChatList) {
	const [showWarningBan, setShowWarningBan] = useState(false);
	const [messageErro, setMessageError] = useState("");

	const getDataChat = (chatName: string, password: string) => {
		return axios.post(`${process.env.REACT_APP_HOST_URL}/chatroom/open-group`, {
			password: password,
			chat_name: chatName,
		}, {
			headers: {
				Authorization: Cookies.get('jwtToken'),
				"ngrok-skip-browser-warning": "69420",
			},
		}).then((response) => {
			return response.data;
		});
	}

	const getDataChatPublic = (chatName: string) => {
		getDataChat(chatName, '').then(() => {
			props.clickedChat(chatName);
		}).catch((err) => {
			setMessageError(err.response.data.msg)
			setShowWarningBan(true);
		});
	}

	const showModal = (chatName: string) => {
		Swal.fire({
			title: 'Digite a senha da sala',
			input: 'password',
			inputAttributes: {
				autocapitalize: 'off'
			},
			showCancelButton: true,
			showLoaderOnConfirm: true,
			confirmButtonText: 'Entrar',
			cancelButtonText: 'Cancelar',
			preConfirm: async (password) => {
				return getDataChat(chatName, password).catch(error => {
					Swal.showValidationMessage(`Erro: ${error.response.data.msg}`);
				});;
			},
			allowOutsideClick: () => !Swal.isLoading(),
			customClass: {
				popup: 'bg-custon-roxo modal-class',
			},
		}).then((result) => {
			if (result.isConfirmed) {
				props.clickedChat(chatName);
			}
		});
	}

	if (!props.listChats || props.listChats.length === 0) {
		return (
			<div>
				<p className='fs-1'>O Game não possui nenhum chat</p>
			</div>
		)
	}

	const divPublicChats = (chat: t_chat): ReactElement => {
		return (
			<div className="border-bottom border-end hover"
				key={chat.id}
				onClick={() => getDataChatPublic(chat.name)}
			>
				<div className='d-flex p-2 justify-content-between' id='sala1'>
					<div>
						<p className='fs-5'>{chat.name}</p>
						<p className='fs-6 d-flex'>Onlines: {chat.onlines}</p>
					</div>
					<div className='ms-3'>
						<p className='fs-5'>Dono do Grupo</p>
						<p className='fs-6'>{chat.owner_nickname}</p>
					</div>
				</div>
			</div>
		)
	}

	const divProtectChats = (chat: t_chat): ReactElement => {
		return (
			<div className="border-bottom border-end hover"
				onClick={() => showModal(chat.name)}
				key={chat.id}
			>
				<div className='d-flex p-2 justify-content-between' id='sala1'>
					<div>
						<p className='fs-5'>{chat.name}</p>
						<p className='fs-6 d-flex'>Onlines: {chat.onlines}
							<BiSolidLock style={{ marginLeft: '5px' }} />
						</p>

					</div>
					<div className='ms-3'>
						<p className='fs-5'>Dono do Grupo</p>
						<p className='fs-6'>{chat.owner_nickname}</p>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className='row g-0 w-100'>
			{showWarningBan ? <BannedWarningModal showWarningBan={setShowWarningBan} messageError={messageErro} /> : null}
			{props.listChats.map((chat) => (
				chat.type !== 'protected' ? divPublicChats(chat) : divProtectChats(chat)
			))}
		</div>
	);
}
