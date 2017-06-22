import React, {PureComponent} from 'react';
import {Layout} from 'antd';
import EditSider from './sider';
import ApiEdit from './apiEdit';

import './edit.scss';

const {Sider, Content} = Layout;

class App extends PureComponent {
	constructor() {
		super();

		const paths = location.pathname.split('/');
        const docId = paths[paths.length - 1];

		this.state = {
			apiId: -1,
			docId
		};
	}
	componentDidMount() {
		window.onhashchange = (e) => {
			const hash = location.hash;
			this.setState({
				apiId: hash.substring(1, hash.length - 1)
			});
		}
	}
	render() {
		const {docId, apiId} = this.state;

		return (
			<div>
				<Layout>
					<Sider><EditSider docId={docId} /></Sider>
					<Content>
						<ApiEdit
							apiId={apiId}
							docId={docId}
						/>
					</Content>
				</Layout>
			</div>
		);
	}
}

export default App;