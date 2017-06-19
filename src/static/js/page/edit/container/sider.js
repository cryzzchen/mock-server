import React, {PureComponent} from 'react';
import {render} from 'react-dom';
import {Tree} from 'antd';
import apis from '../api/index';
import AddModal from './addModal';


const AddBtn = ({addDoc, addApi, addParams}) => {
    return (
        <div className="add-btn-wp">
            <a href="javascript:;" className="add-btn"><i className="iconfont">&#xe6b9;</i></a>
            <div className="add-option-wp">
                <ul>
                    <li onClick={addDoc}>添加目录</li>
                    <li onClick={addApi}>添加API</li>
                    <li onClick={addParams}>添加参数定义</li>
                </ul>
            </div>
        </div>
    );
}

class Sider extends PureComponent {
    constructor(props) {
        super(props);

        const paths = location.pathname.split('/');
        const docId = paths[paths.length - 1];

        this.state = {
            docs: [],
            params: [],
            docId
        };
    }
    componentDidMount() {
        console.log(this.refs);
        apis.getDocsById(this.state.docId).then((result) => {

        });
    }
    addDoc = ({pid, level}) => {
        this.refs.addDocModal.showModal({
            pid,
            level
        });
    }
    addApi = ({docId, level}) => {

    }
    addParams = ({docId, level}) => {

    }
    render() {
        const {docs, apis, params, docId} = this.state;
        const rootConfig = {
            level: 2,
            pid: docId
        };
        return (
            <div className="sider">
                <div className="item">
                    <h3>API目录 <AddBtn
                        addDoc={() => this.addDoc(rootConfig)}
                        addApi={() => this.addApi(rootConfig)}
                        addParams={() => this.addParams(rootConfig)}
                    /></h3>
                </div>
                <div className="item">
                    <h3>参数目录</h3>
                </div>
                <AddModal ref={"addDocModal"} />
            </div>
        );
    }
}

export default Sider;