import React, {PureComponent} from 'react';
import {Input} from 'antd';

class BodyParameter extends PureComponent {
	render() {
		return(
			<Input type="textarea" row={4} placeholder="{data: []}" />
		);
	}
}

export default BodyParameter;