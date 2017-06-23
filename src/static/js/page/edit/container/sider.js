import React, {PureComponent} from 'react';
import {render} from 'react-dom';
import {Tree} from 'antd';
import apis from '../api/index';

const TreeNode = Tree.TreeNode;

class Sider extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            apis: []
        };
    }
    componentDidMount() {
        apis.getApisByDocId(this.props.docId).then(result => {
            this.setState({
                apis: result
            });
        })
    }
    getTree() {
        const {apis} = this.state;
        return <TreeNode key={-1} title="全部接口">
                    <TreeNode key="addapi" title="新建接口" />
                {apis.map(api => {
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
                <div className="item">
                    <div className="list">
                        <Tree
                            className="api-tree"
                            onSelect={this.onSelect}
                        >
                        {this.getTree()}
                        </Tree>
                    </div>
                </div>
            </div>
        );
    }
}

export default Sider;