import { UserData } from '../../../InitialPage/Contexts/Contexts';
import { useContext, useEffect, useState } from 'react';
import { InfosUserPerfil } from '../../typesProfile';
import HandleRank from '../../RankMapings';
import ProfilePhoto from './Image';
import Cookies from 'js-cookie';
import Pointer from './pontos';
import Rank from './rank';
import axios from 'axios';


export default function InformationsUser() {
	const [user, setInfosUser] = useState<InfosUserPerfil>({} as InfosUserPerfil);
	const dataUser = useContext(UserData);

	const getProfile = (): void => {
		axios.get(`${process.env.REACT_APP_HOST_URL}/users/profile/?nick_name=${dataUser.user.nickname}`, {
			headers: {
				Authorization: Cookies.get('jwtToken'),
				"ngrok-skip-browser-warning": "69420"
			}
		})
		.then((res) => {
			setInfosUser(res.data);
		})
		.catch(() => {})
	}

	useEffect(() => {
		getProfile();
	}, []);

	let pointers: number = user.wins - user.loses;
	const { rank, borderImg, borderWrite } = HandleRank(5);
	let aux = user.wins + user.draws;
	let kda: number = aux === 0 ? user.loses : aux / user.loses;
	return (
		<div className='text-center text-white bg- h-100'>
			<ProfilePhoto
				borderImg={borderImg}
				avatar={dataUser.user.avatar}
				nickname={dataUser.user.nickname}
			/>
			<div className='d-flex flex-column align-items-center'>
				<Rank rank={rank} />
				<Pointer
					wins={user.wins}
					loses={user.loses}
					draws={user.draws}
					kda={kda}
					borderWrite={borderWrite}
					pointers={pointers}
				/>
			</div>
		</div>
	);
}
