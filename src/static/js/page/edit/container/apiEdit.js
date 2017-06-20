import React, {PureComponent} from 'react';
import {Button, Input, Row, Col, Table, Select} from 'antd';
import {connect} from 'react-redux';

import PathParameter from './pathParameter';
import RequestParameter from './requestParameter';
import BodyParameter from './bodyParameter';
import ResponseBody from './responseBody';

import actions from '../action/index';

import './apiEdit.scss';
const Option = Select.Option;

const mapStateToProps = (state, ownProps) => {
    const {parameters} = state;
    return {
        ...parameters
    };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
    updateBasicInfo: (info) => dispatch(actions.updateBasicInfo(info)),
    updatePath: (path) => dispatch(actions.updatePath(path)),
    save: () => dispatch(actions.save(ownProps))
});

const ItemName = ({name}) => {
    return (
        <span className="name">{name}</span>
    );
};

class ApiEdit extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            subService: [
                'com.qunhe.service.hello',
                'com.qunhe.service.tob'
            ],
            method: [
                'GET',
                'PUT',
                'POST',
                'DELETE'
            ],
            contentType: [
                'application/json',
                'plain/text',
                'application/x-www-form-urlencoded'
            ]
        };
    }
    render() {
        // dispatch
        const {basicInfo, updateBasicInfo, updatePath, save} = this.props;
        // state
        const {path} = this.props;
        const {subService, method, contentType} = this.state;

        return (
            <div className="edit-wp">
                <div className="intro">
                    <div className="hd">
                        <h3>基本信息</h3>
                        <div className="action">
                            <Button onClick={save}>保存</Button>
                            <Button>取消</Button>
                        </div>
                    </div>
                    <div className="bd">
                        <Row type="flex" justify="center">
                            <Col span={22} className="main">
                                <Row type="flex" className="item">
                                    <Col span={2}><ItemName name={"接口名称"} /></Col>
                                    <Col span={16}><Input onChange={(e) => updateBasicInfo({name: e.target.value})} /></Col>
                                </Row>
                                <Row type="flex" className="item">
                                    <Col span={2}><ItemName name={"api pattern"} /></Col>
                                    <Col span={16}><Input onChange={(e) => updatePath({path: e.target.value})} placeholder={"若有路径参数则：{id},例如：/api/get/doc/{id}"} /></Col>
                                </Row>
                                <Row type="flex" className="item">
                                    <Col span={2}><ItemName name={"子服务"} /></Col>
                                    <Col span={16}>
                                        <Select style={{ width: 240 }} onChange={(e) => updateBasicInfo({subService: e})}>
                                            {subService.map(sub =>
                                                <Option value={sub} key={sub}>{sub}</Option>
                                            )}
                                        </Select>
                                    </Col>
                                </Row>
                                <Row type="flex" className="item" justify="space-between">
                                    <Col span={12}>
                                        <Row>
                                            <Col span={4}><ItemName name={"请求方式"} /></Col>
                                            <Col span={8}>
                                                <Select style={{ width: 240 }} onChange={(e) => updateBasicInfo({method: e})}>
                                                    {method.map(sub =>
                                                        <Option value={sub} key={sub}>{sub}</Option>
                                                    )}
                                                </Select>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row type="flex" className="item" justify="space-between">
                                    <Col span={12}>
                                        <Row>
                                            <Col span={4}><ItemName name={"contentType"} /></Col>
                                            <Col span={8}>
                                                <Select style={{ width: 240 }} onChange={(e) => updateBasicInfo({contentType: e})}>
                                                    {contentType.map(sub =>
                                                        <Option value={sub} key={sub}>{sub}</Option>
                                                    )}
                                                </Select>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row type="flex" className="item">
                                    <Col span={2}><ItemName name={"描述信息"} /></Col>
                                    <Col span={16}><Input type="textarea" rows={2} onChange={(e) => updateBasicInfo({description: e.target.value})} /></Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                </div>
                <div className="path">
                    <div className="hd">
                        <h3>路径参数</h3>
                    </div>
                    <div className="bd">
                        <PathParameter />
                    </div>
                </div>
                <div className="request">
                    <div className="hd">
                        <h3>请求参数(Query)</h3>
                    </div>
                    <div className="bd">
                        <RequestParameter />
                    </div>
                </div>
                <div className="body">
                    <div className="hd">
                        <h3>请求参数(Body)</h3>
                    </div>
                    <div className="bd">
                        <BodyParameter />
                    </div>
                </div>
                <div className="response">
                    <div className="hd">
                        <h3>响应</h3>
                    </div>
                    <div className="bd">
                        <ResponseBody />
                    </div>
                </div>
                <div className="code">
                    <div className="hd">
                        <h3>状态码</h3>
                    </div>
                    <div className="bd">
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ApiEdit);