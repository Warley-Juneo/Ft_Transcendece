import { Modal } from "react-bootstrap";
import { UserData } from "../../InitialPage/Contexts/Contexts";
import { useContext } from "react";
import { dataConvite } from "./Game";

type propsModalConvite = {
	setOpenChat: React.Dispatch<React.SetStateAction<boolean>>;
	dataConvite: dataConvite;
}
export function ModalConvite(props: propsModalConvite): JSX.Element {
	const userData = useContext(UserData).user;
	const cssBackgroundModal: React.CSSProperties = {
		backgroundImage: "url('https://i.pinimg.com/736x/81/60/74/816074bad774e6731e6d9d0d09ce30a6.jpg')",
		backgroundSize: "cover",
		backgroundPosition: "center",
		color: "white"
	}
	const myId = userData.id;
	const sendResponse = () => {
		let obj = {
			myId: myId,
			myNickname: "fake",
			idOther: "idOther",
			msg: "response"
		}
		userData.socket?.emit("sendInvite", obj)
		props.setOpenChat(false);
	}

	return (
		<Modal show={true} onHide={() => props.setOpenChat(false)}>
			<Modal.Header closeButton style={cssBackgroundModal}>
				<p>Convite para partida</p>
			</Modal.Header>
			<Modal.Body>
				<p className="fs-5 text-center"> {props.dataConvite.myNickname} vs {userData.nickname} </p>
				<p className="fs-5 text-center"> {props.dataConvite.myNickname} te convidou para jogar! </p>
				<div className='w-100 d-flex pe-3 justify-content-between'>
					<button className="btn btn-primary" onClick={sendResponse}> Aceitar </button>
					<button className="btn btn-danger" onClick={() => props.setOpenChat(false)}> Cancelar </button>
				</div>
			</Modal.Body>
		</Modal>
	)
}
