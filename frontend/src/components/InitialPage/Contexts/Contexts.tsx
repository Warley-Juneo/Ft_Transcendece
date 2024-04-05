import axios from "axios";
import Cookies from "js-cookie";
import { createContext } from "react";
import { Socket } from "socket.io-client";

export type t_dataUser = {
	id: string;
	nickname: string;
	avatar: string;
	coins: number;
	twoFA: boolean;
	socket: Socket | undefined;
	avatar_name: string;
};

export const UserData = createContext<{
	user: t_dataUser;
	updateDataUser: () => void;
}>({
	user: {
		nickname: '',
		avatar: '',
		id: '',
		coins: 0,
		twoFA: false,
		socket: undefined,
		avatar_name: '',
	},
	updateDataUser: () => { },
})

export async function get_user_by_avatar_name(avatar_name: string): Promise<string> {
	let response = await axios.get(`${process.env.REACT_APP_HOST_URL}/users/find-all`
		, {
			headers: {
				Authorization: Cookies.get('jwtToken'),
				"ngrok-skip-browser-warning": "69420"
			}
		}
	)
	let data = response.data;
	let user = data.find((user: any) => user.avatar_name === avatar_name);
	return user ? user.nickname : "";
}
