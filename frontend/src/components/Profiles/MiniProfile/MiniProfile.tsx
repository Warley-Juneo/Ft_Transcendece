import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import MiniPerfilUser from './MiniPerfilUser';
import Options from './options';
import ListFriends from './ListFriends';
import { Players } from './ListFriends';
import { socket } from '../../InitialPage/Contexts/Contexts';

type propsMiniProfile = {
	showMiniPerfil: React.Dispatch<React.SetStateAction<string>>;
}

export default function MiniProfile(props: propsMiniProfile) {
	const [players, setPlayers] = useState<Players[]>([]);


	function getPlayers(route: string) {
		axios.get(route, {
			headers: {
				Authorization: Cookies.get('jwtToken'),
			}
		}).then((res) => {
			setPlayers(res.data);
		}).catch((err) => {
			console.log(err);
		})
	}

	useEffect(() => {
		getPlayers('http://localhost:3000/users/friends');
	}, []);

	useEffect(() => {
		socket.on('checkStatus', (data: any) => {
			getPlayers('http://localhost:3000/users/friends');
		})
		return () => {
			socket.off('checkStatus');
		}
	}, [socket])

	const cssMiniprfile: React.CSSProperties = {
		backgroundImage: `url('https://s0.smartresize.com/wallpaper/400/885/HD-wallpaper-8-bit-moonlight-8bit-arcade-blue-cloud-moon-pixel.jpg')`,
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		minWidth: '15vw',
		height: '100% !important',
	}

	return (
		<div className='d-flex flex-column position-absolute top-0 end-0 h-100' style={cssMiniprfile}>
			<MiniPerfilUser showMiniPerfil={props.showMiniPerfil}/>
			<hr className='m-0 w-100 text-white'></hr>
			<Options getPlayers={getPlayers} />
			<ListFriends players={players} getPlayers={getPlayers} />
		</div>
	);
}

