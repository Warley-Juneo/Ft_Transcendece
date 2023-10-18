import { useNavigate } from 'react-router';
import './BarOptions.css';
import './buttonRedFormatted.css';

function BarOptions(props: any) {
	const navigate = useNavigate();

	// Função para gerar uma classe aleatória entre "animated-button1" e "animated-button12"
	function randomButtonClass() {
		const randomClass = 'animated-button' + (Math.floor(Math.random() * 12) + 1);
		return randomClass;
	}

	return (
		<div className='d-flex bg-custon-roxo BarOptions'>
			<div className='div-bottom-animation'>
				<span className={randomButtonClass()}>
					<span></span>
					<span></span>
					<span></span>
					<span></span>
					Jogar
				</span>
			</div>
			<div className='div-bottom-animation'>
				<span className={randomButtonClass()} onClick={() => navigate("/game/chats")}>
					<span></span>
					<span></span>
					<span></span>
					<span></span>
					Chats
				</span>
			</div>
			<div className='div-bottom-animation'>
				<span className={randomButtonClass()}>
					<span></span>
					<span></span>
					<span></span>
					<span></span>
					Ranking
				</span>
			</div>
			<div className='div-bottom-animation'>
				<span className={randomButtonClass()}>
					<span></span>
					<span></span>
					<span></span>
					<span></span>
					Histórico
				</span>
			</div>
			<div className='div-bottom-animation'>
				<span className={randomButtonClass()} onClick={() => navigate("/game/profile")}>
					<span></span>
					<span></span>
					<span></span>
					<span></span>
					Perfil
				</span>
			</div>
		</div>
	);
}

export default BarOptions;
