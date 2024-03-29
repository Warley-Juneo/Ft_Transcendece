type propsTitleChatPrivate = {
	nickname: string,
	avatar: string,
}

export default function TitleChatPrivate(props: propsTitleChatPrivate): JSX.Element {
	return (
		<div className="p-2 border-bottom" style={{height: '4rem'}}>
			<img className="h-100 rounded-circle" src={`data:image/png;base64, ${props.avatar}`} alt={`Foto de pefil do user ${props.nickname}`}></img>
			<span className='ms-3 fs-5'>{props.nickname}</span>
		</div>

	)
}
