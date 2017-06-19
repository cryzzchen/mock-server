import React, {Component} from 'react';

class Editor extends Component {
	static defaultProps = {
		className: '',
		jsonText: 'json模式',
		formatText: '格式化'
	}
	constructor(props = {}) {
		super(props);

		this.state = {
			status: 'json'
		};
	}
	renderHtml() {

	}
	render() {
		return (
			<div className={'json-editor ' + this.props.className}>
				<div className="main">
				{
					this.state.status === 'json' ?
					<div className="json">
						<div contentEditable={true}>dsads
						</div>
					</div> :
					<div className="format" />
				}
				</div>
				<div className="action">
					<button >{this.props.jsonText}</button>
					<button >{this.props.formatText}</button>
				</div>
			</div>
		);
	}
}

export default Editor;