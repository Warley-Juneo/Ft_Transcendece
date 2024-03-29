import InfosUser from "./InfosUser";
import MatchHistory from "../ProfilePage/MatchHistory";
import '../ProfilePage/rank.css'
import ButtonClosed from "../../GamePage/Game/ButtonClosed";

type propsDinamicProfile = {
	nickName: string;
	id: string;
	openDinamicProfile: React.Dispatch<React.SetStateAction<string>>;
}

export default function DinamicProfile(props: propsDinamicProfile): JSX.Element {
	const cssBackgroundTerra = {
		backgroundImage: "url(https://socientifica.com.br/wp-content/uploads/2023/06/vida-na-Lua.jpg)",
		backgroundSize: 'cover',
		backgroundPosition: 'contain',
		backgroundRepeat: 'no-repeat',
		zIndex: 1000
	}

	return (
		<div className="text-white h-75 w-75 p-2 bg-degrader position-fixed top-50 start-50 translate-middle" style={cssBackgroundTerra}>
			<div className="d-flex flex-column h-100 position-relative p-5">
				<ButtonClosed backgroundColor="" backgroundShadow="" closed={props.openDinamicProfile} />
				<div style={{ height: '35%' }}>
					<InfosUser nickName={props.nickName} />
				</div>
				<div className='overflow-auto h-100 '>
					<div className="p-3 rounded h-100" id="MatchHistory">
						<MatchHistory userId={props.id} />
					</div>
				</div>
			</div>
		</div>
	)
}
