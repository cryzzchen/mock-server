/*
* 新建参数
*/
import React, {Component} from 'react';
import {Modal, Button, Input, Select, Checkbox, Table} from 'antd';

import http from 'httpClient';

const Option = Select.Option;

class ParamTable extends Component {
    constructor(props) {
    	super(props);

    	this.state = {
    		dataSource: this.props.dataSource || []
    	}
    }
    getType() {
        return ['number', 'string', 'boolean', 'array', 'object'];
    }
    getColumns() {
        return [{
            title: '操作',
            dataIndex: 'op',
            render: (value, row, index) => {
                return (
                    <a href="javascript:;" onClick={() => this.deleteRow(index)}>x</a>
                );
            }
        }, {
            title: '参数',
            dataIndex: 'name',
            render: (value, row, index) => {
                return (
                    <Input value={value} onChange={(e) => {this.updateRow(index, {name: e.target.value})}} />
                );
            }
        }, {
            title: '类型',
            dataIndex: 'type',
            render: (value, row, index) => {
                return (
                    <Select style={{width:100}} onChange={(e) => {this.updateRow(index, {type: e})}}>
                        {this.getType().map(type => {
                            return <Option value={type}>{type}</Option>
                        })}
                    </Select>
                );
            }
        }, {
            title: '必需',
            dataIndex: 'required',
            render: (value, row, index) => {
                return (
                    <Select style={{width:100}} onChange={(e) => {this.updateRow(index, {required: e})}}>
                        <Option value="true">true</Option>
                        <Option value="false">false</Option>
                    </Select>
                );
            }
        }, {
            title: '示例',
            dataIndex: 'example',
            render: (value, row, index) => {
                return (
                    <Input type="textarea" value={value} onChange={(e) => {this.updateRow(index, {example: e.target.value})}} />
                );
            }
        }, {
            title: '描述',
            dataIndex: 'description',
            render: (value, row, index) => {
                return (
                    <Input type="textarea" value={value} onChange={(e) => {this.updateRow(index, {description: e.target.value})}}  />
                );
            }
        }];
    }
    deleteRow = (index) => {
        const {dataSource} = this.state;
        delete dataSource[index];
        this.setState({
            dataSource
        });
    }
    onAddRow = () => {
        const {dataSource} = this.state;
        dataSource.push({});
        this.setState({
            dataSource
        });
    }
    updateRow = (index, obj) => {
        const {dataSource} = this.state;
        dataSource[index] = {
            ...dataSource[index],
            ...obj
        };
        this.setState({
            dataSource
        });
    }
    getDataSource =() => {
        const {dataSource} = this.state;
        let index = 0;
        return dataSource.map(d => {
            d.key = index++;
            return d;
        });
    }
    render() {
        return (
            <Table
                dataSource={this.getDataSource()}
                columns={this.getColumns()}
                pagination={false}
            />
        );
    }
}

class DefinedParams extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            visible: false,
            name: '',
            description: '',
            isArray: this.props.schemaObj.isArray || false
        };
    }
    handleOk = () => {
        const {name, description, isArray} = this.state;
        const dataSource = this.refs.table.getDataSource();
        console.log(name, description, isArray, dataSource);

        this.props.handleOk({isArray, dataSource});
    }
    handleCancel = () => {
        this.props.handleCancel();
    }
    addRow = () => {
        this.refs.table.onAddRow();
    }
    render() {
        const {visible, loading, name, description, isArray} = this.state;

        return (
        <div>
            <Modal
                wrapClassName="parameter-modal"
                visible={true}
                width={1000}
                title={this.props.title}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={[
                    <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
                    <Button key="submit" type="primary" size="large" loading={loading} onClick={this.handleOk}>提交</Button>
                ]}
            >
                {this.props.arrayable &&
                	<Checkbox value={isArray} onChange={(e) => this.setState({isArray: e.target.value})}>是否为数组</Checkbox>
                }
                <ParamTable
                    ref="table"
                    dataSource={this.props.schemaObj.dataSource || []}
                />
                <Button onClick={this.addRow}>新增</Button>
            </Modal>
            </div>
        );
    }
}

export default DefinedParams;