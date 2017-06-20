import React, {Component} from 'react';
import ContentEditable from 'react-contenteditable';
import {Input, Button} from 'antd';

class Editor extends Component {
	static defaultProps = {
		className: '',
		jsonText: 'json模式',
		formatText: '格式化'
	}
	constructor(props = {}) {
		super(props);

		this.state = {
			status: 'json',
			content: ''
		};
	}
	renderHtml() {

	}
	insertifTab(e) {
		const space = '    ';
		if (e.selectionStart || e.selectionStart === '0') {
			const startPos = e.selectionStart;
			const endPos = e.selectionEnd;
			const value = e.value;
			e.value = e.value.substring(0, startPos) + space + e.value.substring(endPos, value.length);
		}
	}
	onKeyDown = (e) => {
		if (e.keyCode === 9) {
			this.insertifTab(e.target);
			e.preventDefault();
		}
	}
	checkJson(text) {
		try {
			json = JSON.parse(text);
			return {
				json,
				valid: true
			};
		} catch(e) {
			alert(e);
			return false;
		}
	}
	formatJson = () => {
		const text = this.refs.textarea.refs.input.value;
		const checkResult = this.checkJson(text);
		if (checkResult && checkResult.valid) {
			console.log('ok');
			this.refs.textarea.refs.input.value = JSON.stringify(checkResult.json, undefined, 2);
		}
	}
	render() {
		console.log(this.state.content)
		return (
			<div className={'json-editor ' + this.props.className}>
				<div className="main">
				{
					this.state.status === 'json' ?
					<div className="json">
						<Input
							className="edit-area"
							type="textarea"
							rows={3}
							onKeyDown={this.onKeyDown}
							onChange={this.onChange}
							ref={"textarea"}
						/>
					</div> :
					<div className="format" />
				}
				</div>
				<div className="action">
					<Button type={this.state.status === 'json' ? 'primary' : 'default'}>{this.props.jsonText}</Button>
					<Button onClick={this.formatJson} type={this.state.status === 'format' ? 'primary' : 'default'}>{this.props.formatText}</Button>
				</div>
			</div>
		);
	}
}

export default Editor;