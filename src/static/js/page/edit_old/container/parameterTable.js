import React, {Component} from 'react';
import ReactDom from 'react-dom';
import {Button, Input, Select, Table} from 'antd';
import DefinedParameter from './definedParam';

const Option = Select.Option;

class ParameterTable extends Component {
    static defaultProps = {
        types: ['number', 'string', 'boolean', 'array', 'object', 'ref'],
        dataSource: [],
        deletable: true,
        addable: true,
        nameChangable: true,
        typeChangable: true,
        addRow: () => {},
        deleteRow: () => {},
        updateRow: () => {}
    };
    showDefinedParamModal = (index, arrayable, schemaObj = {}) => {
        const div = document.createElement('div');
        document.body.appendChild(div);

        const handleCancel = () => {
            ReactDom.unmountComponentAtNode(div);
        }

        const handleOk = (data) => {
            this.updateRow(index, {schemaObj: data});
            handleCancel();
        }

        ReactDom.render(
            <DefinedParameter
                title="自定义结构"
                arrayable={arrayable}
                handleOk={handleOk}
                handleCancel={handleCancel}
                schemaObj={schemaObj}
            />,
            div
        );
    }
    getColumns() {
        const columns = [];
        if (this.props.deletable) {
            columns.push({
                title: '操作',
                dataIndex: 'op',
                render: (value, row, index) => {
                    return (
                        <a href="javascript:;" onClick={() => this.deleteRow(index)}>x</a>
                    );
                }
            });
        }

        columns.push({
            title: '参数',
            dataIndex: 'name',
            render: (value, row, index) => {
                return (
                    <Input value={value} disabled={!this.props.nameChangable} onChange={(e) => {this.updateRow(index, {name: e.target.value})}} />
                );
            }
        });

        columns.push({
            title: '类型',
            dataIndex: 'type',
            render: (value, row, index) => {
                return (
                    <Select value={value} style={{width:100}} onChange={(e) => {this.updateRow(index, {type: e, schema: '', schemaObj: {}})}}>
                        {this.props.types.map(type => {
                            return <Option value={type}>{type}</Option>
                        })}
                    </Select>
                );
            }
        });

        if (this.props.types.indexOf('object') >= 0 || this.props.types.indexOf('array') >= 0) {
            columns.push({
                title: '结构',
                dataIndex: 'schema',
                render: (value, row, index) => {

                    if (row.type === 'array') {
                        return (
                            <div>
                                <Select value={value} style={{width: 100}} onChange={(e) => {this.updateRow(index, {schema: e})}}>
                                    {['number', 'string', 'boolean', '自定义'].map(k => {
                                        return <Option value={k} key={k}>{k}</Option>
                                    })}
                                </Select>
                                {value === '自定义' &&
                                    <Button
                                        onClick={() => this.showDefinedParamModal(index, true,row.schemaObj)}
                                    >自定义结构</Button>
                                }
                            </div>
                        );
                    }
                    if (row.type === 'object') {
                        return (
                            <Button
                                onClick={() => this.showDefinedParamModal(index, false, row.schemaObj)}
                            >自定义结构</Button>
                        );
                    }
                }
            });
        }

        columns.push({
            title: '必需',
            dataIndex: 'required',
            render: (value, row, index) => {
                return (
                    <Select value={value} disabled={!this.props.typeChangable} style={{width:100}} onChange={(e) => {this.updateRow(index, {required: e})}}>
                        <Option value="true">true</Option>
                        <Option value="false">false</Option>
                    </Select>
                );
            }
        });

        columns.push({
            title: '示例',
            dataIndex: 'example',
            render: (value, row, index) => {
                return (
                    <Input type="textarea" value={value} onChange={(e) => {this.updateRow(index, {example: e.target.value})}} />
                );
            }
        });

        columns.push({
            title: '描述',
            dataIndex: 'description',
            render: (value, row, index) => {
                return (
                    <Input type="textarea" value={value} onChange={(e) => {this.updateRow(index, {description: e.target.value})}}  />
                );
            }
        });

        return columns;
    }
    addRow = () => {
        this.props.addRow();
    }
    deleteRow = (index) => {
        this.props.deleteRow(index);
    }
    updateRow = (index, obj) => {
        this.props.updateRow(index, obj);
    }
    render() {
        return (
            <div>
                <Table
                    dataSource={this.props.dataSource}
                    columns={this.getColumns()}
                    pagination={false}
                />
                {this.props.addable && 
                    <Button onClick={() => this.addRow()}>新增</Button>
                }
            </div>
        );
        
    }
}

export default ParameterTable;