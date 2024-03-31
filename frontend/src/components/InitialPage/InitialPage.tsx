import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import axios from "axios";
import Cookies from "js-cookie";
import { UserData, t_dataUser } from './Contexts/Contexts';
import { io } from 'socket.io-client';

export default function InicialPage() {
	let timeForNewRequestAxios: number = 10000;
	let timeout: number = 0;
	const [infoUser, setGetInfoUser] = useState<t_dataUser>({
		nickname: '',
		coins: 0,
		avatar: '',
		id: '',
		twoFA: false,
		socket: undefined,
	});

	function createSocketConnection(id: string, user: string) {
		return io(`${process.env.REACT_APP_HOST_URL}/`, {
			extraHeaders: {
				'ngrok-skip-browser-warning': 'true'
			},
			auth: {
				user_id: id,
				user: user,
			},
		})
	}

	function getUserData() {
		return axios.get(`${process.env.REACT_APP_HOST_URL}/landing-page`, {
			headers: {
				Authorization: Cookies.get('jwtToken'),
				"ngrok-skip-browser-warning": "69420"
			}, timeout: 5000
		}).then((res) => {
			console.log("response...: ", res.data);
			res.data.avatar = `data:image/jpeg;base64, ${res.data.avatar}`
			return res.data;
		});
	}

	function setStatusOnline(res: t_dataUser) {
		let aux = {
			user_id: res.id,
			is_active: true,
			msg: "entrei/sai"
		}
		res.socket?.emit('check-status', aux);
	}

	function getInfoUser() {
		getUserData().then((res) => {
			let socket = createSocketConnection(res.id, res.nickname);
			res.socket = socket;
			setGetInfoUser(res);
			setStatusOnline(res);

		}).catch(() => {
			timeout++
			if (timeout === 5) {
				alert("O servidor esta indisponivel no momento, tente novamente mais tarde.");
				timeForNewRequestAxios = 60000;
			}
			setTimeout(getInfoUser, timeForNewRequestAxios);
		});
	}

	useEffect(() => {
		getInfoUser();
	}, [])
	return (
		<UserData.Provider value={{ user: infoUser, updateDataUser: getInfoUser }}>
			<Outlet />
		</UserData.Provider>

	);
}
