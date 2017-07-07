import React, {Component} form 'react';
import {Button, Modal, Tabs, Radio} from 'antd';
import Editor from './react-json-editor/index';

const TabPane = Tabs.TabPane;
const RadioGroup = Radio.RadioGroup;
const RadioButton = Radio.RadioButton;

class HackTextArea extends Component {
	state = {
		status: 'input'
	}
	onChangeRadio = (e) => {
		console.log(e.target.value);
		this.setState({
			status: e.target.value
		});
	}
	render() {
		return (
			<div>
				<RadioGroup defaultvalue="input" size="large" onChange={(e) => this.onChangeRadio(e)}>
					<RadioButton value="input">输入模式</RadioButton>
					<RadioButton value="table">表格模式</RadioButton>
				</RadioButton>
				<div>
				{
					this.state.status === 'input' ?
					<Editor
						type={this.props.type}
					/>
					:
					<Table>
				}
				</div>
			</div>
		);
	}
}

class HackModal extends Component {
	static defaultProps = {
		title: '自定义结构',
		okText: '确定',
		cancelText: '取消'
	}
	state = {
		visible: false
	}
	render() {
		const {visible} = this.state;
		const {cancelText, okText} = this.props;
		return (
			<Modal
				wrapClassName="hack-modal"
				visible={visible}
				title={this.props.title}
				onOk={this.handleOk}
				onCancel={this.handleCancel}
				footer={[
			            <Button key="back" size="large" onClick={this.handleCancel}>{cancelText}</Button>,
			            <Button key="submit" type="primary" size="large" loading={loading} onClick={this.handleOk}>
			            	{okText}
			            </Button>,
	          		]}
	        >
	        	<HackTextArea
	        		type={this.props.type}
	        	/>
			</Modal>
		);
	}
}

export default HackModal;