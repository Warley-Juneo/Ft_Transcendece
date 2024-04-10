import { useContext, useRef, useState } from "react";
import { IconType } from "react-icons";
import InputButton from "./InputButton";
import { UserData } from "../../../InitialPage/Contexts/Contexts";

type KickMemberProps = {
	Icon: IconType;
	content: string;
	getUserId:  (nickname: string) => Promise<string>;
	my_id: string;
	chat_name: string;
	chat_id: string;
	id: string;
	route: string;
}

export default function ButtonTime(props: KickMemberProps): JSX.Element {
	const [showInput, setShowInput] = useState<boolean>(false);
	const kickHour = useRef<HTMLInputElement>(null);
	const kickDay = useRef<HTMLInputElement>(null);
	const userData = useContext(UserData).user;

	const kickedMember = async (event: React.KeyboardEvent<HTMLInputElement>): Promise<void> => {
		if (event.key !== 'Enter') return;
		const userId = await props.getUserId(event.currentTarget.value);

		let obj = {
			my_id: props.my_id,
			other_id: userId,
			chat_name: props.chat_name,
			chat_id: props.chat_id,
			time: kickHour.current?.checked ? 1 : 24,
		}
		userData.socket?.emit(props.route, obj);
	}

	return (
		<>
			<h5 className="p-2 hover" onClick={() => setShowInput(!showInput)}>
				<props.Icon className="foto-list-friends bg-light text-black me-3 p-1" size={30} />
				{props.content}
			</h5>

			{!showInput ? null :
				<div className="ps-5">
					<div className="form-check">
						<label className="form-check-label" htmlFor={props.id}>
							1 Hora
						</label>
						<input className="form-check-input"
							type="radio"
							name="flexRadioDefault"
							id={props.id}
							ref={kickHour}>
						</input>
					</div>
					<div className="form-check">
						<label className="form-check-label" htmlFor={props.id + '1'}>
							1 Dia
						</label>
						<input
							className="form-check-input"
							type="radio"
							name="flexRadioDefault"
							id={props.id + '1'}
							ref={kickDay}
							defaultChecked >
						</input>
					</div>
					<InputButton function={kickedMember} />
				</div>
			}
		</>
	)
}
