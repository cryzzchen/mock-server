import React, {PureComponent} from 'react';
import {Table, Input, Select} from 'antd';

class RequestParameter extends PureComponent {
	getDataSource() {
		return [];
	}
	getColumns() {
		const columns = [{
			title: '参数',
            dataIndex: 'name',
            key: 'name'
		}, {
			title: '类型',
            dataIndex: 'type',
            key: 'type',
            render(row) {
                return (
                    <Select defaultValue="String" style={{ width: 120 }} onChange={this.onChangeType}>
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
			dataIndex: 'isRequired',
			key: 'isRequired',
			render(row) {
				return (
					<Select style={{ width: 120 }}>
						<Option value="true">true</Option>
						<Option value="false">false</Option>
					</Select>
				);
			}
		}, {
            title: '示例',
            dataIndex: 'example',
            key: 'example',
            render(row) {
                return (
                    <Input />
                );
            }
        }, {
            title: '描述',
            dataIndex: 'desc',
            key: 'desc',
            render(row) {
                return (
                    <Input type="textarea" />
                );
            }
        }];
		return columns;
	}
	render() {
		return (
			<Table
				dataSource={this.getDataSource()}
                columns={this.getColumns()}
                pagination={false}
                rowkey={"name"}
			/>
		);
	}
}

export default RequestParameter;