import React, { useEffect ,useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import MiniPerfil from '../perfilUser/MiniPerfil';
import ChatPrivate from '../chat/chatPrivate';
import BarOptions from '../barOptions/BarOptions';
import ListChats from '../listChats/ListChats';
import ProfileScreen from '../profileScreen/ProfileScreen';

export default function InicialPage() {
	const [currentScreen, setCurrentScreen] = useState('');
	const [currentChat, setCurrentChat] = useState(false);
	const [info, setInfo] = useState(null);

	const data = Cookies.get('login');
	const email = Cookies.get('email');
	console.log("INTIAL PAGE data: ", email);

	function showProfileScreen() {
		setCurrentScreen('profileScreen');
	}

	function showListChats() {
		setCurrentScreen('listChats');
	}

	function showChat() {
		setCurrentChat(currentChat === false ? true : false );
	}

	async function axios_connect(): Promise<void> {
		console.log("InitialPage Axios:", data);
		var response = await axios.post('http://localhost:3000/landing-page', {
			jwt_auth: email,
		})
		setInfo(response.data);
		// 	.then((r) => {
		// 		console.log("AXIOS RESPONSE: ", r);
		// 		if (r.status === 201) {
		// 			console.log('RENDERIZAR A PÀGINA DO GAME...');
		// 			setInfo(r.data);
		// 			console.log("INITIAL PAGE INFO: ", info);
		// 		}
		// 		else {
		// 			console.log("RENDERIZAR PAGINA LOGIN INFORMANDO O ERRO");
		// 		}
		// 	}
		// )
	}

	//THIS FUNCTION IS EXECUTED EVERY TIME THE PAGE IS LOADED
	useEffect(() => {
		axios_connect();
	}, []);

	console.log("INITIAL PAGE INFO2: ", info);
	console.log("INITIAL PAGE INFO2: ", currentScreen);
	console.log("INITIAL PAGE INFO2: ", currentChat);

	return (
		<div className='d-flex' id='home-screen'>
			<div className='d-flex flex-column tela-left' id='left-screen'>
				<div id='main-nav-screen'>
					<BarOptions
						showListChats={showListChats}
						showProfileScreen={showProfileScreen}
					/>
				</div>
				<hr className='m-0 text-white'></hr>

				<div className='m-5' id='dynamic-screen'>
					{currentScreen === 'listChats' ? <ListChats /> : null}
					{currentScreen === 'profileScreen' ? <ProfileScreen /> : null}
				</div>

			</div>
			<div className="d-flex justify-content-end col" id='nav-perfil'>
				{currentChat === true ? <ChatPrivate /> : null}
				<MiniPerfil showChat={showChat} data={data} />
			</div>
		</div>
	);
}
