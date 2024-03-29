
const cssDetails: React.CSSProperties = {
	fontSize: '11px',
}
const cssDetailsHidden: React.CSSProperties = {
	...cssDetails,
	visibility: 'hidden',
}

const cssPhoto: React.CSSProperties = {
	height: '40px',
	width: '40px',
	borderRadius: '50%',
	cursor: 'pointer',
}

type propsMessagePeople = {
	content: string,
	avatarUrl: string,
	dataFormating: string,
	nickname: string,
	id: string,
	showDinamicProfile: (nickname: string, id: string) => void,
}

export default function MessagePeople(props: propsMessagePeople): JSX.Element {
	return (
		<div className='d-flex mb-2'>
			<img	style={cssPhoto}
					src={`data:image/png;base64, ${props.avatarUrl}`}

					alt='foto'
					onClick={() => props.showDinamicProfile(props.nickname, props.id)}
			/>
			<div className='bg-light rounded ms-2 p-2' style={{ whiteSpace: 'pre-line' }}>
				<p>{props.nickname}</p>
				<div className="d-flex">
					<p>{props.content}</p>
					<p className="ms-2" style={cssDetailsHidden}>{props.dataFormating}</p>
				</div>
				<p className="d-flex justify-content-end" style={cssDetails}>{props.dataFormating}</p>
			</div>
		</div>
	)
}
