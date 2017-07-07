import React, {PureComponent} from 'react';
import {Input, Checkbox, Row, Col, Select, Table, Button} from 'antd';
import {connect} from 'react-redux';
import actions from '../action/index';
import ParameterTable from './parameterTable';

// import Editor from './react-json-editor'; 先不用
const Option = Select.Option;

const mapStateToProps = (state, ownProps) => {
    const {parameters} = state;
    return {
        ...parameters
    };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
    updateBodyParams: (body) => dispatch(actions.updateBodyParams(body)),
    updateBodyItem: (response, index) => dispatch(actions.updateBodyItem(response, index)),
    deleteBodyRow: (index) => dispatch(actions.deleteBodyRow(index)),
    addBodyRow: (index) => dispatch(actions.addBodyRow(index))
});

class BodyParameter extends PureComponent {
    // addRow = () => {
    //     this.props.addBodyRow();
    // }
    // deleteRow = (index) => {
    //     this.props.deleteBodyRow(index);
    // }
    // updateRow = (index, obj) => {
    //     this.props.updateBodyItem(obj, index)
    // }
    getDataSource = () => {
        return [this.props.body];
    }
    getColumns() {
        return [{
            title: '类型',
            dataIndex: 'type',
            render: (value, row, index) => {
                return (
                    <Select onChange={(e) => this.props.updateBodyParams({type: e})} style={{width:120}} defaultValue="object" value={value}>
                        {['number', 'string', 'boolean', 'array', 'object', 'ref'].map(key => {
                            return <Option value={key}>{key}</Option>
                        })}
                    </Select>
                );
            }
        }, {
            // 先不考虑引用
            title: '引用',
            dataIndex: 'ref',
            render: (value, row, index) => {
                return (
                    <div />
                );
            }
        }, {
            title:'自定义结构',
            dataIndex: 'schema',
            render: (value, row, index) => {
                return (
                    <Button disabled={!(row.type === 'object' || row.type === 'array')}>自定义结构</Button>
                );
            }
        }, {
            title: '示例',
            dataIndex: 'example',
            render: (value, row, index) => {
                return (
                    <Input type="textarea" rows={3} />
                );
            }
        }, {
            title: '描述',
            dataIndex: 'description',
            render: (value, row, index) => {
                return (
                    <Input type="textarea" rows={3} />
                );
            }
        }];
    }
	render() {
        const {body} = this.props;
		return (
            <div>
                <Table
                    dataSource={this.getDataSource()}
                    columns={this.getColumns()}
                    pagination={false}
                />
             
            </div>
		);
	}
}
   // <ParameterTable
   //                  addRow={this.addRow}
   //                  deleteRow={this.deleteRow}
   //                  updateRow={this.updateRow}
   //                  dataSource={this.getDataSource()}
   //              />
export default connect(mapStateToProps, mapDispatchToProps)(BodyParameter);