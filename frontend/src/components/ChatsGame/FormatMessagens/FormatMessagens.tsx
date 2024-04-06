import { useContext } from "react";
import { ChatContext, Messages } from "../ChatPublic/ChatPublic";
import MessageUser from "./MessageUser";
import MessagePeople from "./MessagePeople";
import { t_dataUser } from "../../InitialPage/Contexts/Contexts";

type propsFormatMessages = {
	messagens: Messages[],
	user: t_dataUser,
	messageErr: String
}

export default function FormatMessages(props: propsFormatMessages): JSX.Element {
	const { setDinamicProfile } = useContext(ChatContext);

	const showDinamicProfile = (nickname: string, id: string) => {
		setDinamicProfile({ nickName: nickname, id: id });
	}
	return (
		<div className="h-100 text-black p-3 overflow-auto">
			{props.messagens.map((message: Messages) => {
				{
					const data = new Date(message.date)
					const dataFormating: string = `${data.getHours()}:${data.getMinutes()}`;
					if (message.user.nickname === props.user.nickname) {
						return (
							<MessageUser
								content={message.content}
								avatarUrl={message.user.avatar}
								dataFormating={dataFormating}
								nickname={message.user.nickname}
								id={message.user.id}
								showDinamicProfile={showDinamicProfile}
								key={message.id}
							/>
						);
					} else {
						return (
							<MessagePeople
								content={message.content}
								avatarUrl={message.user.avatar}
								dataFormating={dataFormating}
								nickname={message.user.nickname}
								avatar_name={message.user.avatar_name}
								showDinamicProfile={showDinamicProfile}
								id={message.user.id}
								key={message.id}
							/>
						);
					};
				}
			})};
			{props.messageErr === "" ? null :
				<div className="text-center text-white">
					<p>{props.messageErr}</p>
				</div>
			}
		</div>
	)
}
