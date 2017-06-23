import React, {PureComponent} from 'react';
import {Layout} from 'antd';
import {connect} from 'react-redux';

import actions from '../action/'
import EditSider from './sider';
import ApiEdit from './apiEdit';

import './edit.scss';

const {Sider, Content} = Layout;

const mapStateToProps = (state) => {
	const {docId} = state.pageInfo;
    return {
    	docId
    };
}

const mapDispathToProps = (dispatch, ownProps) => ({
	updateApiId: (apiId) => dispatch(actions.updatePageInfo(apiId))
})


class App extends PureComponent {
	componentDidMount() {
		const {updateApiId} = this.props;
		window.onhashchange = (e) => {
			const hash = location.hash;
			updateApiId(hash.substring(1, hash.length));
		}
	}
	render() {
		const {docId} = this.props;

		return (
			<div>
				<Layout>
					<Sider><EditSider docId={docId} /></Sider>
					<Content>
						<ApiEdit />
					</Content>
				</Layout>
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispathToProps)(App);