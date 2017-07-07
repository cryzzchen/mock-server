import React, {PureComponent} from 'react';
import {render} from 'react-dom';
import {Tree, Button} from 'antd';
import {connect} from 'react-redux';

import apis from '../api/index';

const TreeNode = Tree.TreeNode;

class ApiTree extends PureComponent {
	state = {
		apis: []
	}
	componentDidMount() {
		apis.getApisByDocId({docid:this.props.docId}).then(result => {
            this.setState({
                apis: result
            });
        });
	}
	onSelect = () => {

	}
	getNewTitle(title) {
        return (
            <div>
                <i className="iconfont">&#xe6b9;</i>
                {title}
            </div>
        );
    }
    getApiName(name) {
        return (
            <div>
                <i className="iconfont">&#xe606;</i>
                {name}
            </div>
        );
    }
	getTree() {
		const {apis} = this.state;
		return <TreeNode key={-1} title="全部接口">
                    <TreeNode key="addapi" title={this.getNewTitle('新建接口')} />
                {apis.map(api => {
                    return <TreeNode key={api._id} title={this.getApiName(api.basicInfo.name)} />
                })}
                </TreeNode>;
	}
	addApi = () => {
        window.location.hash = 'addapi';
    }
    onSelect = (id) => {
        if (id.length > 0 && id[0] !== -1 && id[0] !== '-1'){
            window.location.hash = id;
        }
    }
	render() {
		return (
			<div className="trees">
				<Tree
                    className="api-tree"
                    onSelect={this.onSelect}
                >
                    {this.getTree()}
                </Tree>
			</div>
		);
	}
}
export default ApiTree;