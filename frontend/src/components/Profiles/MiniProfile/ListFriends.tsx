import Status from './PlayersStatus';
import { useContext, useState } from 'react';
import ChatPrivate from '../../ChatsGame/ChatPrivate/ChatPrivate';
import DinamicProfile from '../DinamicProfile/DinamicProfile';
import { IoGameControllerOutline } from "react-icons/io5";
import { UserData } from '../../InitialPage/Contexts/Contexts';

export type Players = {
	avatar: string,
	id: string,
	nickname: string,
	avatar_name: string,
	is_active: boolean,
	match_status: string
}

type PropsListFriends = {
	players: Players[],
	getPlayers: (route: string) => void,
	admin?: Players[]
	mute?: { id: string }[]
}

export default function ListFriends(props: PropsListFriends) {
	const userData = useContext(UserData).user;
	const [chatPrivate, setChatPrivate] = useState(false);
	const [dataOpenDirect, setDataOpenDirect] = useState({ nickname: '', avatart: '' });
	const [dinamicProfile, setDinamicProfile] = useState<string>("");
	const [profileData, setProfileData] = useState<{ id: string, nickname: string }>(
		{ id: '', nickname: '' }
	);

	function handleOpenChatPrivate(nickname: string, avatar: string) {
		setChatPrivate(!chatPrivate)
		setDataOpenDirect({ nickname: nickname, avatart: avatar })
	}

	function clickPhoto(id: string, nickName: string) {
		setDinamicProfile("open")
		setProfileData({ id: id, nickname: nickName })
	}

	function createMatch(idFriend: string) {
		const obj = {
			myId: userData.id,
			myNickname: userData.nickname,
			otherId: idFriend,
			msg: "convite"
		}
		userData.socket?.emit("sendInvite", obj)
	}

	let type = typeof props.players;
	if (!props.players || type === 'string') {
		return (
			<div>
				<div className='d-flex justify-content-center'>
					<p className='text-white'>Carregando...</p>
				</div>
			</div>
		)
	}
	return (
		<div className='p-2 text-white overflow-auto'>
			{!chatPrivate ? null : <ChatPrivate nick_name={dataOpenDirect.nickname} avatar={dataOpenDirect.avatart} />}
			{!dinamicProfile ? null :
				<DinamicProfile
					openDinamicProfile={setDinamicProfile}
					nickName={profileData.nickname}
					id={profileData.id}
				/>
			}
			{
				props.players.map((play: Players) => {
					if (play.id === userData.id) return null
					return (
						<div className='d-flex hover' key={play.id}>
							<img
								className="foto-list-friends"
								src={`data:image/png;base64, ${play.avatar}`}
								alt='foto'
								onClick={() => clickPhoto(play.id, play.nickname)}
							/>
							<div className='d-flex w-100' onClick={() => handleOpenChatPrivate(play.nickname, play.avatar)}>
								<Status
									is_active={play.is_active}
									name={play.avatar_name}
									my_id={userData.id}
									mute={props.mute ? props.mute : []}
									admin={props.admin ? props.admin : []}
									match_status={play.match_status}
									player_id={play.id}
								/>
							</div>
							<div className='d-flex align-items-center me-1'>
								<IoGameControllerOutline
									size={30}
									className='text-warning'
									onClick={() => createMatch(play.id)}
								/>
							</div>
						</div>
					)
				})}

		</div>
	);
}
