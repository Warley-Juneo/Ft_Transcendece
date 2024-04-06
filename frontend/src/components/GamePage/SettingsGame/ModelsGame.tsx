import ButtonModelsGame from "./ButtonModelsGame";
import playPong from '../../../assets/settingsGame/playPong.jpg'
import playSpecialPong from '../../../assets/settingsGame/playSpecialPong.jpg'
import bgFire from "../../../assets/game/planets/backgrounds/bgFire.jpg";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";

export default function ModelsGame(): JSX.Element {

	const cssDivFilhoSelectGame: React.CSSProperties = {
		position: 'relative',
		zIndex: 2,

		backgroundColor: '#ed9121',
		borderRadius: '1rem',
		boxShadow: '1px 2px 2px black inset, 0px -2px 2px #FFF inset',
		opacity: '1 !important',
		backgroundImage: `url(${bgFire})`,
		backgroundSize: 'cover',
	}

	const [isOpen, setIsOpen] = useState(false);

	const openModal = () => {
		setIsOpen(true);
	};

	const closeModal = () => {
		setIsOpen(false);
	};

	return (
		<div style={cssDivFilhoSelectGame}>
			<button onClick={openModal}>Regras do Jogo!</button>

			<Modal show={isOpen} onHide={closeModal}>
				<Modal.Header closeButton>
					<Modal.Title>Regras Gerais: </Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>O jogador que fizer 10 pontos primeiro ganha.</p>
					<p>Em caso de desconexão você perde automaticamente.</p>
					<p>O modo normal game possui pooderes</p>
					<p>O modo ranqueado é o padrão pong 1972</p>
					<br></br>

					<h6>Teclas:</h6>
					<p><u>W</u>  subir raquete</p>
					<p><u>S</u>  descer raquete </p>
				</Modal.Body>
				<Modal.Footer>
					<button onClick={closeModal}>Close</button>
				</Modal.Footer>
			</Modal>

			<div className="d-flex p-3" id='divOptionsStartGame'>
				<ButtonModelsGame
					photo={playPong}
					model="Normal"
					isRanking={false}
				/>
				<ButtonModelsGame
					photo={playPong}
					model="Ranqueado"
					isRanking={true}
				/>
				<ButtonModelsGame
					photo={playPong}
					model="VS COOP"
				/>
			</div>

			<div className="d-flex p-3">
				<ButtonModelsGame
					photo={playSpecialPong}
					model="Normal"
				/>
				<ButtonModelsGame
					photo={playSpecialPong}
					model="Ranqueado"
				/>
				<ButtonModelsGame
					photo={playSpecialPong}
					model="VS COOP"
				/>
			</div>
		</div>
	)
}
