import React, {Component} from 'react';
import {Layout, Row, Col} from 'antd';
import 'antd/dist/antd.css';
import '../global.css';

const {Header, Sider, Content} = Layout;

class Frame extends Component {
    render() {
        const {content} = this.props;
        return (
            <Layout>
                <Header>这里是目录</Header>
                <Content>
                    <div id="content">
                        <Row type="flex" justify="center">
                            <Col span={20}>{content}</Col>
                        </Row>
                    </div>
                </Content>
            </Layout>
        );
    }
}

export default Frame;