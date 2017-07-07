/*
* 数据保存面板-通用组件
*/

import React, {Component} from 'react';
import {Modal, Button, Input, Table} from 'antd';

class dataTable extends Component {
    getColumns() {
        return [{
            title: '参数',
            dataIndex: 'name'
        }, {
            title: '类型',
            dataIndex: 'type'
        }, {
            title: '结构',
            dataIndex: 'schema'
        }, {
            title: '必需',
            dataIndex: 'required'
        }, {
            title: '描述',
            dataIndex: 'description'
        }, {
            title: '示例',
            dataIndex: 'example',
            render: (value, row, index) => {
                return (
                    <Input type="textarea" value={value} onChange={(e) => {this.updateRow(index, {example: e.target.value})}} />
                );
            }
        }];
    }
    render() {
        return (
            <Table
                dataSource={this.props.dataSource}
                columns={this.getColumns()}
                pagination={false}
            />
        );
    }
}

class DataSaveModal extends Component {
    contructor(props) {
        super(props);
        this.state = {
            loading: false,
            visibile: false
        };
    }
    handleCancel = () => {

    }
    handleOk = () => {
        
    }
    render() {
        const {visibile} = this.state;
        const {path, query, body, response} = this.props;
        return (
            <Modal
                wrapClassName="data-save-modal"
                visibile={visibile}
                title="保存API数据"
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={[
                    <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
                    <Button key="submit" type="primary" size="large" loading={loading} onClick={this.handleOk}></Button>
                ]}
            >
                <Input placeholder="数据名称" />
                {path && path.length > 0 &&
                    <div>
                        <p>路径参数</p>
                        <dataTable
                            dataSource={path}
                        />
                    </div>
                }
                {
                    query && query.length > 0 &&
                    <div>
                        <p>query参数</p>
                        <dataTable
                            dataSource={query}
                        />
                    </div>
                }
                {
                    body &&
                    <div>
                        <p>body参数</p>
                        <dataTable
                            dataSource={body}
                        />
                        {body.type === 'array' &&
                            <Button>新增一项</Button>
                        }
                    </div>
                }
                {
                    response && response.length > 0 &&
                    <div>
                        <p>响应</p>
                        <dataTable
                            dataSource={response}
                        />
                    </div>
                }
            </Modal>
        );
    }
}

export default DataSaveModal;