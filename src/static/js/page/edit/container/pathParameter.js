/**
* 路径参数
*/

import React, {Component} from 'react';
import {Table, Input, Select} from 'antd';
import _ from 'lodash';
import {connect} from 'react-redux';
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
    getDataSource(params = []) {
        const dataSource = this.dataSource;

        const nextDataSource = [];

        params.forEach(p => {
            const tmp = _.find(dataSource, (d) => {
                return (d.name === p.name);
            });
            if (tmp) {
                nextDataSource.push(tmp);
            } else {
                nextDataSource.push({
                    name: p.name
                });
            }
        });

        this.dataSource = nextDataSource;

        return nextDataSource;
    }
    onChangeType = (value, index) => {
        this.props.updatePathParams({type: value}, index);
    }
    onChangeExample = (value, index) => {
        this.props.updatePathParams({example: value}, index);
    }
    onChangeDesc = (value, index) => {
        this.props.updatePathParams({description: value}, index);
    }
    getColumns() { 
        const columns = [{
            title: '参数',
            dataIndex: 'name',
            key: 'name',
            render(value, row, index) {
                return <div>{value}</div>;
            }
        }, {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            render: (value, row, index) => {
                return (
                    <Select defaultValue="String" style={{ width: 120 }} onChange={(e) => this.onChangeType(e, index)}>
                        <Option value="String">String</Option>
                        <Option value="Number">Number</Option>
                        <Option value="Boolean">Boolean</Option>
                        <Option value="Array">Array</Option>
                        <Option value="Date">Date</Option>
                    </Select>
                );
            }
        }, {
            title: '示例',
            dataIndex: 'example',
            key: 'example',
            render: (value, row, index) => {
                return (
                    <Input onChange={(e) => this.onChangeExample(e.target.value, index)} />
                );
            }
        }, {
            title: '描述',
            dataIndex: 'desc',
            key: 'desc',
            render: (value, row, index) => {
                return (
                    <Input onChange={(e) => this.onChangeDesc(e.target.value, index)} type="textarea" />
                );
            }
        }];

        return columns;
    }
    render() {
        const {path} = this.props;

        return (
            <div>
                <p className="desc">注意：(1)无论什么类型，在路径中均被转成字符串。例如类型为数组，内容为[1,2]的designids，在路径中为“/[1,2]”;
                                                (2) 路径参数为必需项，若不是必需，则写成两个API
                </p>
                <Table
                    dataSource={this.getDataSource(path)}
                    columns={this.getColumns()}
                    pagination={false}
                    rowkey={'name'}
                />
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PathParameter);