/**
* 路径参数
*/

import React, {Component} from 'react';
import {Table, Input, Select} from 'antd';
import _ from 'lodash';
import {connect} from 'react-redux';
import ParameterTable from './parameterTable';
import actions from '../action/index';

const Option = Select.Option;

const mapStateToProps = (state, ownProps) => {
    const {parameters} = state;
    return {
        ...parameters
    };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
    updatePathParams: (params, index) => {
        dispatch(actions.updatePathParams(params, index));
    }
});

class PathParameter extends Component {
    constructor() {
        super();
        this.dataSource = [];
    }
    getDataSource() {
        const dataSource = this.dataSource;
        const {path} = this.props;

        const nextDataSource = [];

        path.forEach(p => {
            const tmp = _.find(dataSource, (d) => {
                return (d.name === p.name);
            });
            if (tmp) {
                nextDataSource.push(tmp);
            } else {
                nextDataSource.push({
                    ...p
                });
            }
        });

        this.dataSource = nextDataSource;

        return nextDataSource;
    }
    updateRow = (index, obj) => {
        this.props.updatePathParams(obj, index);
    }
    render() {
        const {path} = this.props;

        return (
            <div>
                <p className="desc">注意：(1)无论什么类型，在路径中均被转成字符串。例如类型为数组，内容为[1,2]的designids，在路径中为“/[1,2]”;
                                                (2) 路径参数为必需项，若不是必需，则写成两个API
                </p>
                <ParameterTable
                    types={['number', 'string', 'boolean']}
                    deletable={false}
                    addable={false}
                    nameChangable={false}
                    typeChangable={false}
                    dataSource={this.props.path}
                    updateRow={this.updateRow}
                />
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PathParameter);