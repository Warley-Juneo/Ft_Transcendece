import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { AuthLogin } from './authLogin';
import { useNavigate } from 'react-router';
import './style.css';
import { Button, Modal } from 'react-bootstrap';

export function Login() {
	const navigate = useNavigate();
	const [showModal, setShowModal] = useState<boolean>(false);

	//ACCESS BACKEND AFTER GET THE CODE AT
	function axios_connect() {
		let paramters = new URLSearchParams(window.location.search);
		let code = paramters.get('code');
		if (code) {
			axios.post(`${process.env.REACT_APP_HOST_URL}/auth`, {
				authCode: code,
			}, {
				timeout: 5000,
			}).then((response) => {
				Cookies.set('jwtToken', response.data._access_token);// set expires time
				Cookies.set('email', response.data._email);
				return response.data
			})
			.then(() => {verifyEnabled()})
			.catch(() => {})
		}
		return undefined;
	}

	const verifyTwoFA = () => {
		let token = document.getElementById('input-token') as HTMLInputElement;
		if (token.value === '') return;

		axios.post(`${process.env.REACT_APP_HOST_URL}/2FA/validate`, {
			token: token.value,
		}, {
			headers: {
				Authorization: Cookies.get('jwtToken'),
				"ngrok-skip-browser-warning": "69420"
			},
			timeout: 10000,
		}).then((res) => {
			if (res.data === true)
				navigate('/game')
		}).catch(() => {});
	}

	const verifyEnabled = () => {
		axios.get(`${process.env.REACT_APP_HOST_URL}/2FA/verifyStatus`, {
			headers: {
				Authorization: Cookies.get('jwtToken'),
				"ngrok-skip-browser-warning": "69420"
			},
		}).then((res) => {
			if (res.data === true) {
				setShowModal(true);
			} else {
				navigate('/game')
			}
		}).catch(() => {})
	}


	useEffect(() => {
		axios_connect();
	}, []);

	return (
		<div className="login  ">
			<div className="form_container">
				<form>
					<h3 className="text-center">Sign in</h3>
					<div className="d-grid">
						<button onClick={AuthLogin}>Sign in</button>
					</div>
				</form>
			</div>
			<Modal show={showModal} onHide={() => setShowModal(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Habilitar Two Factor Authenticator</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<input id='input-token' type="text" className="form-control" placeholder="Digite o codigo de verificação" aria-label="Recipient's username" aria-describedby="basic-addon2" />
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowModal(false)}>
						Fechar modal
					</Button>
					<Button variant="primary" onClick={verifyTwoFA}>
						Salvar alterações
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
}
