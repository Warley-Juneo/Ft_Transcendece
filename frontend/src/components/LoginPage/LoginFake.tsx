import axios from "axios";
import Cookies from "js-cookie";
import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";


export default function LoginFake(): JSX.Element {
	const navigate = useNavigate();

	const saveInfosBackend = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		const loginValue = formData.get('login') as string;
		const emailValue = formData.get('email') as string;
		const nickNameValue = formData.get('nickName') as string;

		axios.post(`${process.env.REACT_APP_HOST_URL}/auth/fake`, {
			login: loginValue,
			email: emailValue,
			nickname: nickNameValue,
			first_name: 'first_name',
			last_name: 'last_name',
		}, {
			headers: {
				"ngrok-skip-browser-warning": "69420"
			}
		},
		).then((res) => {
			Cookies.set('jwtToken', res.data._access_token);// set expires time
			Cookies.set('email', res.data._email);
			navigate('/game/', { replace: true });
		}
		).catch((err) => {
		})
	}

	return (
		<div className="login">
			<div className="form_container">
				<form onSubmit={saveInfosBackend}>
					<div>
						<label htmlFor="login">Login</label>
						<input type="text" id="login" name="login" />
					</div>
					<div>
						<label htmlFor="email">Email</label>
						<input type="text" id="email" name="email" />
					</div>
					<div>
						<label htmlFor="nickName">NickName</label>
						<input type="text" id="nickName" name="nickName" />
					</div>
					<button type="submit">send</button>
				</form>
			</div>
		</div>
	)
}
