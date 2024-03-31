import { FaEye } from "react-icons/fa";
import React, { useContext } from "react";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { FaTableTennisPaddleBall } from "react-icons/fa6";
import { UserData } from '../../InitialPage/Contexts/Contexts';

import { GoMute } from "react-icons/go";
import { Players } from "./ListFriends";

const cssOnlineBorder: React.CSSProperties = {
	backgroundColor: 'rgb(10, 235, 10)',
	borderRadius: '50%',
	height: '12px',
	width: '12px',
	marginRight: '5px',
};

const cssOnline: React.CSSProperties = {
	backgroundColor: '#009000',
	borderRadius: '50%',
	height: '8px',
	width: '8px',
};

const CSSOfflineBorder: React.CSSProperties = {
	...cssOnlineBorder,
	backgroundColor: '#d3d3d3',
};

const CSSOffline: React.CSSProperties = {
	...cssOnline,
	backgroundColor: '#666',

};

type PropsStatus = {
	name: string,
	my_id: string,
	admin: Players[],
	mute: { id: string }[]
	is_active: boolean,
	match_status: string
	player_id: string
}

export default function Status(props: PropsStatus): JSX.Element {
	const userData = useContext(UserData).user;

	const handleWatchPath = (e: React.MouseEvent<SVGElement, MouseEvent>): void => {
		e.stopPropagation();
		let obj = {
			playerId: props.my_id,
			watcherId: props.player_id
		}
		userData.socket?.emit('watch-match', obj);
	}

	const getIcons = (): JSX.Element => {

		const cssSecond: React.CSSProperties = {
			marginLeft: '2px',
			marginBottom: '2px'
		}

		const cssIcons: React.CSSProperties = {
			marginLeft: '6px',
			marginBottom: '2px'
		}

		const cssWatch: React.CSSProperties = {
			...cssIcons,
			zIndex: '1',
		}
		return (
			<>
				{!props.mute.find((item) => item.id === props.player_id) ? null :
					<GoMute key={props.player_id + '1'} style={cssIcons} />
				}
				{!props.admin.find((item) => item.id === props.player_id) ? null :
					<MdOutlineAdminPanelSettings key={props.player_id} style={cssSecond} />
				}
				{!(props.match_status === "WATCHING") ? null :
					<FaEye style={cssWatch}/>
				}
				{!(props.match_status === "PLAYING") ? null :
					<FaTableTennisPaddleBall style={cssWatch} onClick={handleWatchPath}
					/>
				}
			</>
		)
	}

	const getStatusONorOFF = (status: boolean): JSX.Element => {
		if (status) {
			return (
				<div className='d-flex align-items-center'>
					<div style={cssOnlineBorder}
						className='d-flex justify-content-center align-items-center'>
						<div style={cssOnline}></div>
					</div>
					<p>Online</p>
				</div>
			)
		}
		return (
			<div className='d-flex align-items-center'>
				<div style={CSSOfflineBorder}
					className='d-flex justify-content-center align-items-center'>
					<div style={CSSOffline}></div>
				</div>
				<p>Offline</p>
			</div>
		)
	}

	return (
		<div className="p-1">
			<div className="d-flex align-items-end">
				<p>{props.name}</p>
				{getIcons()}
			</div>
			{getStatusONorOFF(props.is_active)}

		</div>
	);
}
