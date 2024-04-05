import { IoMdArrowDropdown } from 'react-icons/io';
import { UserData } from '../../InitialPage/Contexts/Contexts';
import React, { useContext, useState } from 'react';
import Status from './PlayersStatus';
import ConfigurationGame from './Configurations/Configurations';
import OptionsMiniProfile from './OptionsMiniProfile';

type propsMiniProfile = {
	showMiniPerfil: React.Dispatch<React.SetStateAction<string>>;
}

export default function MiniPerfilUser(props: propsMiniProfile) {
	const userData = useContext(UserData).user;
	const [optionsConf, setOptionsConf] = useState<boolean>(false);
	const [showConfigurations, setShowConfigurations] = useState<boolean>(false);


	if (userData.nickname === '' || userData.avatar === '') {
		return (
			<div className='d-flex p-3' style={{ height: '15vh' }}>
				<div className="spinner-border text-primary m-auto h-75" role="status">
					<span className="visually-hidden m-auto">Loading...</span>
				</div>
			</div>
		);
	}
	return (
		<div className='d-flex p-3 text-white' style={{ height: '15vh' }}>
			{showConfigurations ? <ConfigurationGame closed={setShowConfigurations} /> : null}
			<div className='h-100 d-flex align-items-center'>
				<img className="rounded-circle h-100 w-100 me-3" src={userData.avatar} alt='foto' />
				<Status
					is_active={true}
					name={userData.avatar_name}
					my_id={userData.id}
					admin={[]}
					mute={[]}
					match_status={''}
					player_id={''}
				/>
			</div>
			<div className='ms-auto'>
				<IoMdArrowDropdown
					className="d-flex m-auto"
					type='button'
					size={30}
					onClick={() => setOptionsConf(!optionsConf)}
				/>
				{!optionsConf ? null :
					<OptionsMiniProfile
						showMiniPerfil={props.showMiniPerfil}
						id={userData.id}
						setShowConfigurations={setShowConfigurations}
					/>}
			</div>
		</div>
	)
}
