import React, {Component} from 'react';
import {Input, Button, Table, Select} from 'antd';

const Option = Select.Option;

class FormatTable extends Component {
    constructor(props) {
        super(props);
    }
    getDataSource() {

    }
    getTypeSelect(value) {
        const {types} = this.props;
        return (
            <Select value={value} style={{ width: 120 }}>
                {types.map(type => 
                    <Option value={type} key={key}>{type}</Option>
                    )}
                }
                {
                    this.props.customable &&
                    <Option value="custom">自定义</Option>
                }
            </Select>
        );
    }
    getColumns() {
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
                return this.getTypeSelect(value);
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
            title: '自定义结构',
            dataIndex: 'scheme',
            key: 'scheme',
            render: (value, row, index) => {
                if (row.type === 'custom') {    // 表示为自定义
                    // todo
                }
            }
        }];
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

class Editor extends Component {
    static defaultProps = {
        className: '',
        type: 'json',
        jsonText: 'json模式',
        formatText: '格式化',
        placeholder: '',
        types: [],
        customable: true
    }
    constructor(props = {}) {
        super(props);

        this.state = {
            content: '',
            status: 'json'
        };
    }
    renderHtml() {

    }
    insertifTab(e) {
        const space = '    ';
        if (e.selectionStart || e.selectionStart === '0') {
            const startPos = e.selectionStart;
            const endPos = e.selectionEnd;
            const value = e.value;
            e.value = e.value.substring(0, startPos) + space + e.value.substring(endPos, value.length);
        }
    }
    onKeyDown = (e) => {
        if (e.keyCode === 9) {
            this.insertifTab(e.target);
            e.preventDefault();
        }
    }
    checkJson(text) {
        try {
            json = JSON.parse(text);
            return {
                json,
                valid: true
            };
        } catch(e) {
            alert(e);
            return false;
        }
    }
    formatJson = () => {
        const text = this.refs.textarea.refs.input.value;
        const checkResult = this.checkJson(text);
        if (checkResult && checkResult.valid) {
            this.refs.textarea.refs.input.value = JSON.stringify(checkResult.json, undefined, 2);
            this.setState({
                // status: 'format',
                content: checkResult.json
            });
        }
    }
    render() {
        console.log(this.state.content)
        return (
            <div className={'json-editor ' + this.props.className}>
                <div className="main">
                {
                    this.state.status === 'json' ?
                    <div className="json">
                        <Input
                            className="edit-area"
                            type="textarea"
                            rows={3}
                            onKeyDown={this.onKeyDown}
                            onChange={this.onChange}
                            placeholder={this.props.placeholder}
                            ref={"textarea"}
                        />
                    </div> :
                    <div className="format">
                        <FormatTable
                            types={this.props.types}
                            customable={this.props.customable}
                        />
                    </div>
                }
                </div>
                <div className="action">
                    <Button onClick={this.formatJson} type={this.state.status === 'format' ? 'primary' : 'default'}>{this.props.formatText}</Button>
                </div>
            </div>
        );
    }
}

export default Editor;