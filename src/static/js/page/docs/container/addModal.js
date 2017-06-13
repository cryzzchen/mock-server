import React, {Component} from 'react';
import {Modal, Button, Input} from 'antd';
import apis from '../api/index';

class App extends Component {
	state = {
		loading: false,
		visible: false
	}
	showModal = () => {
	    this.setState({
	      	visible: true,
	    });
	}
	handleOk = () => {
	    this.setState({ loading: true });
	    apis.createDoc({
	    	name: this.state.name,
	    	desc: this.state.desc
	    }).then(() => {
	    	this.setState({ loading: false, visible: false });
	    });
	}
	handleCancel = () => {
	    this.setState({ visible: false });
	}
	changeName = (e) => {
		this.setState({
			name: e.target.value
		});
	}
	changeDesc = (e) => {
		this.setState({
			desc: e.target.value
		});
	}
	render() {
		const {visible, loading} = this.state;
		return (
			<div className="add-wp">
				<a href="javascript:;" className="add" onClick={this.showModal}>
	                <i className="iconfont">&#xe6b9;</i> 创建新文档
	            </a>
				<Modal
					wrapClassName="add-modal"
		          	visible={visible}
		         	title="创建新文档"
		          	onOk={this.handleOk}
		          	onCancel={this.handleCancel}
		         	 	footer={[
				            <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
				            <Button key="submit" type="primary" size="large" loading={loading} onClick={this.handleOk}>
				              创建
				            </Button>,
		          		]}
		        >
		        	<Input placeholder="文档名称" onChange={this.changeName} />
		        	<Input className="textarea" type="textarea" onChange={this.changeDesc} placeholder="文档描述..." rows={3} />
		        </Modal>
	        </div>
		);
	}
}

export default App;