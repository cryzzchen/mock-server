import React, {PureComponent} from 'react';
import {Input} from 'antd';
import {connect} from 'react-redux';
import actions from '../action/index';
import Editor from './react-json-editor';

const mapStateToProps = (state, ownProps) => {
    const {parameters} = state;
    return {
        ...parameters
    };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
    updateBodyParams: (body) => actions.updateBodyParams(body);
});

class BodyParameter extends PureComponent {
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
        const {body} = this.props;
		return(
            <Editor
                value={body}
                placeholder="{data: []}"
                types={this.getTypes()}
                customable={true}
                onFormatChange={(c) => this.props.updateBodyParams({body: c})}
            />
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(BodyParameter);