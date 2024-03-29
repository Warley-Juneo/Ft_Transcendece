import React, { useContext, useEffect, useState } from "react"
import BarDataUsers from "./BarDataUsers/BarDataUsers"
import { useNavigate, useParams } from "react-router-dom"
import { UserData } from "../../InitialPage/Contexts/Contexts"
import winner from "../../../assets/game/winner.png"
import losser from "../../../assets/game/losser.jpg"

type GamePongProps = {
	ball: { positionX: number, positionY: number, size: number },
	paddleLeft: { positionX: number, position_front: number, height: number, width: number, velocity: number }
	paddleRight: { positionX: number, position_front: number, height: number, width: number, velocity: number }
	placarLeft: number,
	placarRight: number,
	winner: string,
	window: { height: number, width: number }
	player_left: { id: string, status: boolean, nickname: string },
	player_right: { id: string, status: boolean, nickname: string },
	watchs: [],
	power: { x: number, y: number, size: number }
}

export default function GameWW(): JSX.Element {
	const userData = useContext(UserData).user;

	const [fakeGame, setFakeGame] = useState<GamePongProps>({
		ball: { positionX: 400, positionY: 300, size: 24 },
		paddleLeft: { positionX: 20, position_front: 300, height: 120, width: 40, velocity: 5 },
		paddleRight: { positionX: 780, position_front: 300, height: 120, width: 40, velocity: 5 },
		placarLeft: 0,
		placarRight: 0,
		winner: '',
		window: { height: 600, width: 800 },
		player_left: { id: '123', status: true, nickname: "Luffytaro" },
		player_right: { id: '1234', status: true, nickname: "Zorotaro" },
		watchs: [],
		power: { x: 0, y: 0, size: 0 }
	})

	const room = useParams().room
	const cssDivGame: React.CSSProperties = {

		height: `${fakeGame.window.height}%`,
		width: `${fakeGame.window.width}%`,
		boxShadow: '0px 0px 15px 5px white',
		position: 'relative',
	}

	const divFilds: React.CSSProperties = {
		height: `${fakeGame.window.height}%`,
		width: '2%',
		backgroundColor: 'white',
		position: 'absolute',
		top: 0,
		left: '50%',
	}

	useEffect(() => {
		userData.socket?.on('updateGame', (data: GamePongProps) => {
			setFakeGame(data)
		})
	}, [])


	useEffect(() => {
		const intervalId = setInterval(() => {
			userData.socket?.emit('updateGame', room)
		},30);

		return () => {
			clearInterval(intervalId);
			userData.socket?.emit('disconnect-user', {room: room, id: userData.id});
		}
	}, [room])

	const paddleLeft: React.CSSProperties = {
		height: `${fakeGame.paddleLeft.height}%`,
		width: `${fakeGame.paddleLeft.width}%`,
		backgroundColor: 'white',
		position: 'absolute',
		top: `${fakeGame.paddleLeft.position_front}%`,
		left: `${fakeGame.paddleLeft.positionX}%`,
	}

	const paddleRight: React.CSSProperties = {
		height: `${fakeGame.paddleRight.height}%`,
		width: `${fakeGame.paddleRight.width}%`,
		backgroundColor: 'white',
		position: 'absolute',
		top: `${fakeGame.paddleRight.position_front}%`,
		left: `${fakeGame.paddleRight.positionX}%`,
	}

	const ball: React.CSSProperties = {
		height: `${window.innerHeight * 0.03}px`,
		width: `${window.innerHeight * 0.03}px`,
		backgroundColor: 'white',
		position: 'absolute',
		top: `${fakeGame.ball.positionY}%`,
		left: `${fakeGame.ball.positionX}%`,
		borderRadius: '50%',
	}

	function hadleMovie(key: string) {
		if (key !== 'w' && key !== 's') return

		let isLeft = fakeGame.player_left.id === userData.id ? true : false
		let isUp = key === 'w' ? true : false
		userData.socket?.emit('updatePaddle', { roomID: room, isLeft: isLeft, isUp: isUp, pause: false })
	}

	const movePaddleLeft = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (fakeGame.winner !== "") return null
		if (fakeGame.watchs.find(id => id === userData.id)) return null

		if (e.key === 'p') {
			userData.socket?.emit('updatePaddle', { roomID: room, isLeft: false, isUp: false, pause: true })
		}
		else if (e.key === 'l') {
			userData.socket?.emit('updatePaddle', { roomID: room, isLeft: false, isUp: false, pause: false })
		}
		else {
			hadleMovie(e.key)
		}
	}

	const cssPage: React.CSSProperties = {
		height: '100vh',
		width: '100vw',
		overflow: 'hidden',
		backgroundImage: `url(https://wallpaperaccess.com/full/2513478.jpg)`,
		backgroundSize: 'cover',
	}



	let power: React.CSSProperties = {}
	if (fakeGame.power) {
		power = {
			height: fakeGame.power.size,
			width: fakeGame.power.size,
			backgroundColor: 'white',
			position: 'absolute',
			top: fakeGame.power.y,
			left: fakeGame.power.x,
			borderRadius: '50%',
		}
	}

	const cssWinner: React.CSSProperties = {
		backgroundImage: `url(${winner})`,
		backgroundSize: 'cover',
		backgroundPosition: 'center',
	}

	const cssloser: React.CSSProperties = {
		...cssWinner,
		backgroundImage: `url(${losser})`,
	}
	const navigate = useNavigate()

	if (fakeGame.winner !== "") {
		if (fakeGame.winner === userData.id) {
			return (
				<div className="vh-100 p-5" style={cssWinner}>
					<button className="btn btn-danger" onClick={() => navigate('/game')}>Exit Game</button>
				</div>
			)
		} else {
			return (
				<div className="vh-100 p-5" style={cssloser}>
					<button className="btn btn-danger" onClick={() => navigate('/game')}>Exit Game</button>
				</div>
			)
		}
	}

	return (
		<div style={cssPage} tabIndex={0} onKeyDown={movePaddleLeft}>

			<div className="d-flex flex-column justify-content-center align-items-center h-75 container">
				<BarDataUsers
					nicknameLeft={fakeGame.player_left.nickname}
					nicknameRight={fakeGame.player_right.nickname}
					gameWight={fakeGame.window.width}
				/>

				{/* Componente */}
				<div style={cssDivGame} >
					<div style={divFilds}></div>
					<div style={paddleLeft}></div>
					<div style={paddleRight}></div>
					<div style={ball}></div>
					{fakeGame.power ? <div style={power}></div> : null}

					<div className="d-flex">
						<div className="w-50 text-white text-center">
							<p className="fs-1">{fakeGame.placarLeft}</p>
						</div>

						<div className="w-50 text-white text-center">
							<p className="fs-1">{fakeGame.placarRight}</p>
						</div>
					</div>

				</div>
			</div>
		</div>
	)
}
