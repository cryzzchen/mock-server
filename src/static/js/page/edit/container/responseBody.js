import React, {Component} from 'react';
import {Input} from 'antd';
import Editor from './react-json-editor';

class ResponseBody extends Component {
	getTypes() {
        return [
            'string',
            'int',
            'float',
            'boolean',
            'array',
            'date'
        ];
    }
	render() {
		return(
            <Editor
                placeholder="{data: []}"
                types={this.getTypes()}
                customable={true}
            />
		);
	}
}

export default ResponseBody;