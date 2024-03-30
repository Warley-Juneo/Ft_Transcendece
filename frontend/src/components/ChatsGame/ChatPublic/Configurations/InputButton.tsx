type propsInputButton = {
	function: (event: React.KeyboardEvent<HTMLInputElement>) => void,
	placeholder?: string,
}

export default function InputButton(props: propsInputButton): JSX.Element {
	return (
		<input
			type="text"
			className="remove-format-input"
			placeholder={props.placeholder ? props.placeholder : "Digite o nome do usuário"}
			onKeyDown={props.function}
		/>
	)
}

export function InputButtonBMK(props: propsInputButton): JSX.Element {
	return (
		<div className="ms-5">

			<div className="form-check">
				<input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1"></input>
				<label className="form-check-label" htmlFor="flexRadioDefault1">
					1 hora
				</label>
			</div>
			<div className="form-check">
				<input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2"></input>
				<label className="form-check-label" htmlFor="flexRadioDefault2">
					1 dia
				</label>
			</div>
			<div className="form-check">
				<input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault3"></input>
				<label className="form-check-label" htmlFor="flexRadioDefault3">
					1 semana
				</label>
			</div>
			<input
				type="text"
				className="remove-format-input"
				placeholder={props.placeholder ? props.placeholder : "Digite o nome do usuário"}
				onKeyDown={props.function}
			/>
		</div>
	)
}
