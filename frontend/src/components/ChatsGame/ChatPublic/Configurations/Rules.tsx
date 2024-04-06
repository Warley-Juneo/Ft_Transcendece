export default function Rules({rules}: {rules: string[]}) : JSX.Element {
	return (
		<div className="text-start p-3">
			<h4>Regras : </h4>
			<ul>
				{rules.map((rule, index) => (<li key={index}>{rule}</li>))}
			</ul>
		</div>
	)
}
