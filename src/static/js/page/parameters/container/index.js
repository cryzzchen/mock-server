import React, {PureComponent} from 'react';
import {Tabs} from 'antd';

import apis from '../api/index';

const TabPane = Tabs.TabPane;

class App extends PureComponent {
	componentDidMount() {
		apis.getParams().then((params = []) => {

		});
	}
	onChange = () => {

	}
	getNoTree() {

	}

	getTree() {

	}
	render() {
		return (
			<Tabs defaultActiveKey="notree" onChange={this.onChange}>
				<TabPane tab="Tab notree" key="notree">{this.getNoTree()}</TabPane>
				<TabPane tab="Tab tree" key="tree">{this.getTree()}</TabPane>
			</Tabs>
		);
	}
}

export default App;