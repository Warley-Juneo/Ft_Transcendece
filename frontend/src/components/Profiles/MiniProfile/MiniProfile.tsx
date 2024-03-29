import React, { useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import MiniPerfilUser from './MiniPerfilUser';
import Options from './options';
import ListFriends from './ListFriends';
import { Players } from './ListFriends';
import { UserData } from '../../InitialPage/Contexts/Contexts';

type propsMiniProfile = {
	showMiniPerfil: React.Dispatch<React.SetStateAction<string>>;
}

export default function MiniProfile(props: propsMiniProfile) {
	const [players, setPlayers] = useState<Players[]>([]);
	const userData = useContext(UserData).user;

	function getPlayers(route: string) {
		axios.get(route, {
			headers: {
				Authorization: Cookies.get('jwtToken'),
				"ngrok-skip-browser-warning": "69420"
			}
		}).then((res) => {
			setPlayers(res.data);
		}).catch((err) => {
		})
	}

	useEffect(() => {
		getPlayers(`${process.env.REACT_APP_HOST_URL}/users/friends`);
	}, []);

	useEffect(() => {
		userData.socket?.on('checkStatus', (data: any) => {
			getPlayers(`${process.env.REACT_APP_HOST_URL}/users/friends`);
		})
		// return () => {
		// 	socket.off('checkStatus');
		// }
	}, [userData.socket])

	const cssMiniprfile: React.CSSProperties = {
		display: 'flex',
		flexDirection: 'column',

		backgroundImage: `url('https://s0.smartresize.com/wallpaper/400/885/HD-wallpaper-8-bit-moonlight-8bit-arcade-blue-cloud-moon-pixel.jpg')`,
		backgroundSize: 'cover',
		backgroundPosition: 'center',

		height: '100% !important',
		width: '25vw',
	}

	return (
		<>
			<div className='position-absolute top-0 end-0 h-100' style={cssMiniprfile}>
				<MiniPerfilUser showMiniPerfil={props.showMiniPerfil} />
				<hr className='m-0 w-100 text-white'></hr>
				<Options getPlayers={getPlayers} />
				<ListFriends players={players} getPlayers={getPlayers} />
			</div>
		</>
	);
}

