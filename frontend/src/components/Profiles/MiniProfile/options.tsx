// import { GiThreeFriends } from 'react-icons/gi';
import { FaPeopleGroup } from "react-icons/fa6";
import { FaUserFriends } from 'react-icons/fa';
import { MdPersonRemoveAlt1, MdPersonAddAlt1 } from "react-icons/md";
import { MdBlock } from "react-icons/md";
import {get_user_by_avatar_name} from '../../InitialPage/Contexts/Contexts';

import React, { useContext, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { UserData } from "../../InitialPage/Contexts/Contexts";

const URLS_MiniPerfilPlayers = {
	'personal': `${process.env.REACT_APP_HOST_URL}/users/friends`,
	'Global': `${process.env.REACT_APP_HOST_URL}/users/find-all`,
}

function Options({ getPlayers }: { getPlayers: (route: string) => void }) {
	const [showADDFriend, setShowAddFriend] = useState(false);
	const [showDLTFriend, setShowDLTFriend] = useState(false);
	const [showBLOKFriend, setShowBLOKFriend] = useState(false);
	const userData = useContext(UserData).user;
	//todo criar um componente botão pra nao precisar ficar criando varios use stage


	async function addNewFriend(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key !== 'Enter') return

		let user_nickname = await get_user_by_avatar_name(event.currentTarget.value);

		axios.post(`${process.env.REACT_APP_HOST_URL}/users/add_friend`, {
			nick_name: user_nickname,
		}, {
			headers: {
				Authorization: Cookies.get('jwtToken'),
				"ngrok-skip-browser-warning": "69420"
			},
		})
		.then(() => {
			getPlayers(URLS_MiniPerfilPlayers.personal);
		}).catch(() => {})
	}

	async function DeleteFriend(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key !== 'Enter') return

		let user_nickname = await get_user_by_avatar_name(event.currentTarget.value);

		axios.post(`${process.env.REACT_APP_HOST_URL}/users/delete_friend`, {
			nick_name: user_nickname,
		}, {
			headers: {
				Authorization: Cookies.get('jwtToken'),
				"ngrok-skip-browser-warning": "69420"
			},
		})
		.then((res) => {
			getPlayers(URLS_MiniPerfilPlayers.personal);
		}).catch(() => { })
	}

	async function BlockUser(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key !== 'Enter') return

		let other_nickname = await get_user_by_avatar_name(event.currentTarget.value);

		let obj = {
			my_nickname: userData.nickname,
			other_nickname: other_nickname
		}

		userData.socket?.emit("direct-block", obj)
	}

	function returnInput(func: (event: React.KeyboardEvent<HTMLInputElement>) => void) {
		return (
			<div className='rounded'>
				<input
					type='text'
					className='remove-format-input'
					placeholder='Search Friend'
					onKeyDown={func}
				/>
			</div>
		)
	}

	const styleButton: React.CSSProperties = {
		margin: '5px',
		cursor: 'pointer',
	}
	return (
		<div className='p-2'>
			<div className='d-flex align-items-center text-white'>
				<p className='fw-bold'>Social</p>
				<div className='d-flex justify-content-end w-100 options'>
					{/* TODO: ADDED Function to delete friend */}
					<MdBlock
						style={styleButton}
						size={30}
						onClick={
							() => {
								setShowAddFriend(false)
								setShowDLTFriend(false)
								setShowBLOKFriend(!showBLOKFriend)
							}
						}
					/>
					<MdPersonRemoveAlt1
						style={styleButton}
						size={30}
						onClick={() => {
							setShowBLOKFriend(false)
							setShowAddFriend(false)
							setShowDLTFriend(!showDLTFriend)
						}}
					/>
					<MdPersonAddAlt1
						style={styleButton}
						size={30}
						onClick={
							() => {
								setShowBLOKFriend(false)
								setShowDLTFriend(false)
								setShowAddFriend(!showADDFriend)
							}
						}
					/>
					<FaUserFriends
						style={styleButton}
						size={30} onClick={() => getPlayers(URLS_MiniPerfilPlayers.personal)}
					/>
					<FaPeopleGroup
						style={styleButton}
						size={30} onClick={() => getPlayers(URLS_MiniPerfilPlayers.Global)}
					/>

				</div>
			</div>
			{showADDFriend ? returnInput(addNewFriend) : null}
			{showDLTFriend ? returnInput(DeleteFriend) : null}
			{showBLOKFriend ? returnInput(BlockUser) : null}
		</div>
	)
}

export default Options
