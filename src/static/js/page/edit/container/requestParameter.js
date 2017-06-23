import React, {PureComponent} from 'react';
import {Table, Input, Select, Button} from 'antd';

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
    getColumns() {
        const {updateQueryParams, deleteRow} = this.props;
        const columns = [{
            title: '操作',
            dataIndex: 'op',
            key: 'op',
            render: (value, row, index) => {
                return <a href="javascript:;" className="delete" onClick={() => deleteRow(index)}>x</a>
            }
        }, {
            title: '参数',
            dataIndex: 'name',
            key: 'name',
            render: (value, row, index) => {
                return (
                    <Input onChange={(e) => updateQueryParams({name: e.target.value}, index)} />
                );
            }
        }, {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            render: (value, row, index) => {
                return (
                    <Select defaultValue="String" style={{ width: 120 }} onChange={(type) => updateQueryParams({type}, index)}>
                        <Option value="String">String</Option>
                        <Option value="Id">Id</Option>
                        <Option value="Number">Number</Option>
                        <Option value="Boolean">Boolean</Option>
                        <Option value="Array">Array</Option>
                        <Option value="Date">Date</Option>
                    </Select>
                );
            }
        }, {
            title: '是否必需',
            dataIndex: 'required',
            key: 'required',
            render: (value, row, index) => {
                return (
                    <Select defaultValue="false" style={{ width: 120 }} onChange={(required) => updateQueryParams({required}, index)}>
                        <Option value="true">true</Option>
                        <Option value="false">false</Option>
                    </Select>
                );
            }
        }, {
            title: '示例',
            dataIndex: 'example',
            key: 'example',
            render: (value, row, index) => {
                return (
                    <Input onChange={(e) => updateQueryParams({example: e.target.value}, index)} />
                );
            }
        }, {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
            render: (value, row, index) => {
                return (
                    <Input type="textarea" onChange={(e) => updateQueryParams({description: e.target.value}, index)} />
                );
            }
        }];
        return columns;
    }
    addRow = () => {
        this.props.addRow(this.index++);
    }
    render() {
        const {query} = this.props;
        return (
            <div>
                <Table
                    dataSource={query}
                    columns={this.getColumns()}
                    pagination={false}
                />
                <div className="action">
                    <Button onClick={this.addRow}>新增</Button>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestParameter);