import React, {Component} from 'react';
import {Input} from 'antd';

class ResponseBody extends Component {
	render() {
		return(
			<Input type="textarea" rows={4} placeholder="{data: []}" />
		);
	}
}

export default ResponseBody;