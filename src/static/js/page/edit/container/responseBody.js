import React, {Component} from 'react';
import {Input} from 'antd';
import {connect} from 'react-redux';
import actions from '../action/index';
import Editor from './react-json-editor';

const mapStateToProps = (state, ownProps) => {
    const {response} = state;
    return {
        ...response
    };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
    updateResponse: (response) => dispatch(actions.updateResponse(response))
});

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
                value={this.props['200']}
                placeholder="{data: []}"
                types={this.getTypes()}
                customable={true}
                onFormatChange={(c) => this.props.updateResponse({200: c})}
            />
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ResponseBody);