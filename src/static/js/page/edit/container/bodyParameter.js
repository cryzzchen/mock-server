import React, {PureComponent} from 'react';
import {Input} from 'antd';
import {connect} from 'react-redux';
import actions from '../action/index';

const mapStateToProps = (state, ownProps) => {
    const {parameters} = state;
    return {
        ...parameters
    };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
    updateBasicInfo: (info) => dispatch(actions.updateBasicInfo(info)),
    updatePath: (path) => dispatch(actions.updatePath(path))
});

class BodyParameter extends PureComponent {
	render() {
		return(
			<Input type="textarea" rows={4} placeholder="{data: []}" />
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(BodyParameter);