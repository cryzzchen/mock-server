import React, {PureComponent} from 'react';
import {Button, Input, Row, Col, Table} from 'antd';
import PathParameter from './pathParameter';

import './apiEdit.scss';

const ItemName = ({name}) => {
    return (
        <span className="name">{name}</span>
    );
};

class ApiEdit extends PureComponent {
    componentDidMount() {
        // 判断是新建还是编辑
    }
    render() {
        return (
            <div className="edit-wp">
                <div className="intro">
                    <div className="hd">
                        <h3>基本信息</h3>
                        <div className="action">
                            <Button>保存</Button>
                            <Button>取消</Button>
                        </div>
                    </div>
                    <div className="bd">
                        <Row type="flex" justify="center">
                            <Col span={22} className="main">
                                <Row type="flex" className="item">
                                    <Col span={2}><ItemName name={"接口名称"} /></Col>
                                    <Col span={16}><Input /></Col>
                                </Row>
                                <Row type="flex" className="item">
                                    <Col span={2}><ItemName name={"api pattern"} /></Col>
                                    <Col span={16}><Input placeholder={"若有路径参数则：{:id},例如：/api/get/doc/{:id}"} /></Col>
                                </Row>
                                <Row type="flex" className="item">
                                    <Col span={2}><ItemName name={"子服务"} /></Col>
                                    <Col span={16}><Input /></Col>
                                </Row>
                                <Row type="flex" className="item" justify="space-between">
                                    <Col span={12}>
                                        <Row>
                                            <Col span={4}><ItemName name={"请求方式"} /></Col>
                                            <Col span={8}><Input /></Col>
                                        </Row>
                                    </Col>
                                    <Col span={12}>
                                        <Row>
                                            <Col span={4}><ItemName name={"请求协议"} /></Col>
                                            <Col span={8}><Input /></Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row type="flex" className="item" justify="space-between">
                                    <Col span={12}>
                                        <Row>
                                            <Col span={4}><ItemName name={"请求格式"} /></Col>
                                            <Col span={8}><Input /></Col>
                                        </Row>
                                    </Col>
                                    <Col span={12}>
                                        <Row>
                                            <Col span={4}><ItemName name={"响应格式"} /></Col>
                                            <Col span={8}><Input /></Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row type="flex" className="item">
                                    <Col span={2}><ItemName name={"描述信息"} /></Col>
                                    <Col span={16}><Input type="textarea" /></Col>
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

                    </div>
                </div>
                <div className="request">
                    <div className="hd">
                        <h3>请求参数</h3>
                    </div>
                </div>
                <div className="response">
                    <div className="hd">
                        <h3>响应</h3>
                    </div>
                </div>
            </div>
        );
    }
}

export default ApiEdit;