import React, {PureComponent} from 'react';
import {Layout} from 'antd';
import {connect} from 'react-redux';

import ApiTree from './apiTree';

const {Sider, Content} = Layout;


const mapStateToProps = (state) => {
    return {
    };
}

const mapDispathToProps = (dispatch, ownProps) => ({
})

class App extends PureComponent {
    render() {
        return (
            <div>
                <Layout>
                    <Sider>
                        <ApiTree />
                    </Sider>
                    <Content>

                    </Content>
                </Layout>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispathToProps)(App);