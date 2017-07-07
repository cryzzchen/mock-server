import React, {PureComponent} from 'react';
import {Table, Input, Select, Button} from 'antd';

import _ from 'lodash';
import {connect} from 'react-redux';
import actions from '../action/index';
import ParameterTable from './parameterTable';

const Option = Select.Option;

const mapStateToProps = (state, ownProps) => {
    const {parameters} = state;
    return {
        ...parameters
    };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
    updateQueryParams: (params, index) => {
        dispatch(actions.updateQueryParams(params, index));
    },
    deleteRow: (index) => {
        dispatch(actions.deleteQueryParam(index));
    },
    addRow: (index) => {
        dispatch(actions.addQueryParam(index));
    }
});

class RequestParameter extends PureComponent {
    constructor() {
        super();

        this.index = 0;
    }
    addRow = (index) => {
        this.props.addRow(this.index++);
    }
    deleteRow = (index) => {
        this.props.deleteRow(this.index--);
    }
    updateRow = (index, obj) => {
        this.props.updateQueryParams(obj, index);
    }
    getDataSource = () => {
        this.index = this.props.query.length;
        return this.props.query;
    }
    render() {
        const {query} = this.props;
        return (
            <ParameterTable
                types={['number', 'string', 'boolean']}
                addRow={this.addRow}
                deleteRow={this.deleteRow}
                updateRow={this.updateRow}
                dataSource={this.getDataSource()}
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestParameter);