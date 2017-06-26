import React, {PureComponent} from 'react';
import {render} from 'react-dom';
import {Tree} from 'antd';
import apis from '../api/index';

const TreeNode = Tree.TreeNode;

class Sider extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            apis: [],
            overApis: []
        };
    }
    componentDidMount() {
        apis.getApisByDocId({docid:this.props.docId}).then(result => {
            this.setState({
                apis: result
            });
        });

        apis.getApisByDocId({
            docid:this.props.docId,
            overdue: true
        }).then(result => {
            this.setState({
                overApis: result
            });
        });
    }
    getApiName(name) {
        return (
            <div>
                <i className="iconfont">&#xe606;</i>
                {name}
            </div>
        );
    }
    getNewTitle(title) {
        return (
            <div>
                <i className="iconfont">&#xe6b9;</i>
                {title}
            </div>
        );
    }
    getTree() {
        const {apis} = this.state;
        return <TreeNode key={-1} title="全部接口">
                    <TreeNode key="addapi" title={this.getNewTitle('新建接口')} />
                {apis.map(api => {
                    return <TreeNode key={api._id} title={this.getApiName(api.basicInfo.name)}>
                                <TreeNode key={12} title={this.getNewTitle('新建数据')} />
                            </TreeNode>
                })}
                </TreeNode>;
    }
    getOverDueTree() {
        // 获得过期API
        const {overApis} = this.state;
        return <TreeNode key={-1} title="过期接口">
                {overApis.map(api => {
                    return <TreeNode key={api._id} title={api.basicInfo.name} />
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
            <div className="sider">
                <Tree
                    className="api-tree"
                    onSelect={this.onSelect}
                >
                    {this.getTree()}
                </Tree>
                <Tree
                    className="api-tree overdue"
                    onSelect={this.onSelect}
                >
                    {this.getOverDueTree()}
                </Tree>
            </div>
        );
    }
}

export default Sider;