/*
* 新建参数
*/
import React, {Component} from 'react';
import {Modal, Button, Input, Select, Checkbox, Table} from 'antd';

import http from 'httpClient';

const Option = Select.Option;

class ParamTable extends Component {
    state = {
        dataSource: []
    }
    getType() {
        return ['integer', 'number', 'string', 'boolean', 'array', 'object'];
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
            title: '结构',
            dataIndex: 'schema',
            render: (value, row, index) => {
                return (
                    <Button
                        disabled={row.type !== 'array' && row.type !== 'object'}
                    >自定义结构</Button>
                );
            }
        },{
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

class Parameter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            visible: false,
            name: '',
            description: '',
            isArray: false
        };
    }
    handleOk = () => {
        const {name, description, isArray} = this.state;
        const dataSource = this.refs.table.getDataSource();
        console.log(name, description, isArray, dataSource);

        this.setState({
            loading: true
        });

        http.post('/api/paramter/create?docid=' + this.props.docId, {
            name,
            description,
            isArray,
            params: dataSource
        }, {}, 'application/json;charset=UTF-8').then(() => {
            this.setState({
                loading: false,
                visible: false
            });
        }, (xhr) => {
            this.setState({
                loading: false
            });
            alert('失败');
        })
    }
    handleCancel = () => {
        this.setState({
            loading: false,
            loading: false
        });
    }
    addRow = () => {
        this.refs.table.onAddRow();
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    render() {
        const {visible, loading, name, description, isArray} = this.state;

        return (
        <div>
            <Button onClick={() => this.showModal()}>这里</Button>
            <Modal
                wrapClassName="parameter-modal"
                visible={visible}
                width={1000}
                title="新建参数结构"
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={[
                    <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
                    <Button key="submit" type="primary" size="large" loading={loading} onClick={this.handleOk}>提交</Button>
                ]}
            >
                <Input placeholder="名称" value={name} onChange={(e) => this.setState({name: e.target.value})} />
                <Input placeholder="描述" value={description} onChange={(e) => this.setState({description: e.target.value})} />
                <Checkbox value={isArray} onChange={(e) => this.setState({isArray: e.target.value})}>是否为数组</Checkbox>
                <ParamTable
                    ref="table"
                />
                <Button onClick={this.addRow}>新增</Button>
            </Modal>
            </div>
        );
    }
}

export default Parameter;