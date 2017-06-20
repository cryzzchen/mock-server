import React, {PureComponent} from 'react';
import {Layout} from 'antd';
import EditSider from './sider';
import ApiEdit from './apiEdit';

import './edit.scss';

const {Sider, Content} = Layout;

class App extends PureComponent {
	render() {
		return (
			<div>
				<Layout>
					<Sider><EditSider /></Sider>
					<Content><ApiEdit /></Content>
				</Layout>
			</div>
		);
	}
}

export default App;