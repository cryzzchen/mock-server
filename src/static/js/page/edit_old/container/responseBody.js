import React, {Component} from 'react';
import {Input, InputNumber, Checkbox} from 'antd';
import {connect} from 'react-redux';
import actions from '../action/index';
import ParameterTable from './parameterTable';

 class ResponseTable extends ParameterTable {
    getColumns() {
        const columns = super.getColumns();
        // 操作
        columns[0].render = (value, row, index) => {
            if (row.name === '200' || row.name === 200) {
                return <div />
            } else {
                return <a href="javascript:;" onClick={() => this.deleteRow(index)}>x</a>
            }
        }
        // 参数
        columns.title = '状态码';
        columns[1].render = (value, row, index) => {
            return (
                <InputNumber
                    min={1}
                    value={value}
                    disabled={value === '200' || value === 200}
                    onChange={(e) => this.updateRow(index, {name: e.target.value})}
                />
            );
        };

        // 必需
       delete columns[4];
        return columns;
    }
 }

 const mapStateToProps = (state, ownProps) => {
    const {response} = state;
    return {
        response: response.concat([])
    };
 };

 const mapDispatchToProps = (dispatch, ownProps) => ({
    addRow: () => dispatch(actions.addResponseRow()),
    deleteRow: (index) => dispatch(actions.deleteResponseRow(index)),
    updateRow: (index, obj) => dispatch(actions.updateResponse(obj, index))
 });

 class ResponseBody extends Component {
    addRow = (index) => {
        this.props.addRow(this.index++);
    }
    deleteRow = (index) => {
        this.props.deleteRow(this.index--);
    }
    updateRow = (index, obj) => {
        this.props.updateRow(index, obj);
    }
    getDataSource() {
        const {response} = this.props;
        return response;
    }
    render() {
        return (
            <ResponseTable
                addRow={this.addRow}
                deleteRow={this.deleteRow}
                updateRow={this.updateRow}
                dataSource={this.getDataSource()}
            />
        );
    }
 }

 export default connect(mapStateToProps, mapDispatchToProps)(ResponseBody);