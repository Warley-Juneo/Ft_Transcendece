import ProfilePhoto from "../ProfilePage/Perfil/Image";
import { useEffect, useState } from "react";
import { InfosUserPerfil } from "../typesProfile";
import axios from "axios";
import Cookies from "js-cookie";
import HandleRank from "../RankMapings";
import Rank from "../ProfilePage/Perfil/rank";
import Pointer from "../ProfilePage/Perfil/pontos";

export default function InfosUser({ nickName }: { nickName: string }): JSX.Element {
	const [infosUser, setInfosUser] = useState<InfosUserPerfil>({} as InfosUserPerfil);

	const getProfile = (): void => {
		axios.get(`${process.env.REACT_APP_HOST_URL}/users/profile/?nick_name=${nickName}`, {
			headers: {
				Authorization: Cookies.get('jwtToken'),
				"ngrok-skip-browser-warning": "69420",
			}
		}).then((response) => {
			setInfosUser(response.data);
		}
		).catch((error) => {
			
		})
	}

	useEffect(() => {
		getProfile();
	}, []);

	let pointers: number = infosUser.wins - infosUser.loses;
	const { rank, borderImg, borderWrite } = HandleRank(pointers);
	let aux = infosUser.wins + infosUser.draws;
	let kda: number = aux === 0 ? infosUser.loses : aux / infosUser.loses;

	return (
		<div className="row g-0 align-items-center text-center h-100">
			<div className="col-4 h-100">
				<ProfilePhoto
					borderImg={borderImg}
					avatar={infosUser.avatar}
					nickname={infosUser.nickname}
				/>
			</div>
			<div className="col-4 h-100">
				<Rank rank={rank} />
			</div>
			<div className="col-4 h-100">
				<Pointer wins={infosUser.wins}
					loses={infosUser.loses}
					draws={infosUser.draws}
					kda={kda}
					borderWrite={borderWrite}
					pointers={pointers}
				/>
			</div>
		</div>
	)
}
