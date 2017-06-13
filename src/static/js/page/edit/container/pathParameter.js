/**
* 路径参数
*/

import React, {Component} from 'react';
import {Table, Input} from 'antd';

class PathParameter extends Component {
	constructor(props = {}) {
		super(props);

		this.state = {
			params: this.props.params || []
		};
	}
	render() {
	}
}