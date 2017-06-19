/**
* 路径参数
*/

import React, {Component} from 'react';
import {Table, Input, Select} from 'antd';

const Option = Select.Option;

class PathParameter extends Component {
    getDataSource() {
        const params = this.props.params || [];
        let dataSource;
        if (this.state && this.state.dataSource) {
            dataSource = Object.assign(this.state.dataSource);
        } else {
            dataSource = [];
        }

        const nextDataSource = [];

        dataSource.forEach(data => {
            if (params.indexOf(data.name) >= 0) {
                data.key = index++;
                nextDataSource.push(data);
                params.splice(params.indexOf(data.name), 1);
            }
        });

        params.forEach(p => {
            nextDataSource.push({
                name: p
            });
        });

        // this.setState({
        //     dataSource: nextDataSource
        // });

        return nextDataSource;
    }
    onChangeType = () => {

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
            render(value, row, index) {
                return (
                    <Select defaultValue="String" style={{ width: 120 }} onChange={this.onChangeType}>
                        <Option value="String">String</Option>
                        <Option value="Number">Number</Option>
                        <Option value="Boolean">Boolean</Option>
                        <Option value="Array">Array</Option>
                        <Option value="Date">Date</Option>
                        <Option value="Ref">Ref</Option>
                        <Option value="自定义">自定义</Option>
                    </Select>
                );
            }
        }, {
            title: '示例',
            dataIndex: 'example',
            key: 'example',
            render(value, row, index) {
                return (
                    <Input />
                );
            }
        }, {
            title: '描述',
            dataIndex: 'desc',
            key: 'desc',
            render(value, row, index) {
                return (
                    <Input type="textarea" />
                );
            }
        }];

        return columns;
    }
    render() {
        return (
            <div>
                <p className="desc">注意：(1)无论什么类型，在路径中均被转成字符串。例如类型为数组，内容为[1,2]的designids，在路径中为“/[1,2]”;
                                                (2) 路径参数为必需项，若不是必需，则写成两个API
                </p>
                <Table
                    dataSource={this.getDataSource()}
                    columns={this.getColumns()}
                    pagination={false}
                    rowkey={'name'}
                />
            </div>
        );
    }
}

export default PathParameter;