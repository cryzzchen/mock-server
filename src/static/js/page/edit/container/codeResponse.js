import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {Table, Input} from 'antd';

const mapStateToProps = (state) => {
	return {};
}

const mapDispatchToProps = (dispatch, ownProps) => ({

});

class CodeResponse extends PureComponent {
	getDataSource() {
		return [];
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
        	title: '状态码',
        	dataIndex: 'number',
        	key: 'number',
        	render: (valule, row, index) => {
        		return <Input value={value} />
        	}
        }, {
        	title: 'response',
        	dataIndex: 'response',
        	key: 'response',
        	render: (value, row, index) => {
        		return <div />;
        	}
        }, {
        	title: '描述',
        	dataIndex: 'description',
        	key: 'description',
        	render: (value, row, index) => {
        		return (
        			<Input type="textarea" rows={2} />
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
			/>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CodeResponse);
