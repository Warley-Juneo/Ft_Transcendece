
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

type propsMessageUser = {
	content: string,
	avatarUrl: string,
	dataFormating: string,
	nickname: string,
	id: string
	showDinamicProfile: (nickname: string, id: string) => void,
}

export default function MessageUser(props: propsMessageUser): JSX.Element {
	return (
		<div className='d-flex mb-2 justify-content-end'>
			<div className='bg-light rounded me-2 p-2' style={{ whiteSpace: 'pre-line' }}>
				<div className="d-flex">
					<p>{props.content}</p>
					<p className="me-2" style={cssDetailsHidden}>{props.dataFormating}</p>
				</div>
				<p className="d-flex justify-content-end" style={cssDetails}>{props.dataFormating}</p>
			</div>
			<img style={cssPhoto}
				src={`data:image/png;base64, ${props.avatarUrl}`}
				alt='foto'
				onClick={() => props.showDinamicProfile(props.nickname, props.id)}
			/>
		</div>
	)
}
