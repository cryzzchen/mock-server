/*
* 文档列表
*/

import React, {PureComponent} from 'react';
import {Table, Row, Col} from 'antd';

import apis from '../api/index';
import AddModal from './addModal';
import './list.scss';

const DocItem = ({doc}) => {
    const onDelete = () => {
        apis.deleteDoc(doc._id).then(() => {
            window.location.reload();
        });
    }
    const formatTime = () => {
        const timestamp = doc.lastModified ? doc.lastModified : doc.createdTime;
        const date = new Date(timestamp);
        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
    }
    const getDocLink = () => {
        return `/swagger?url=${window.location.protocol}//${window.location.host}/json/${doc._id}.json`;
    }
    if (doc.name) {
        return (
            <div className="item">
                <a href={getDocLink()} target="_blank"><h3>{doc.name}</h3></a>
                <a href={'/doc/edit/' + doc._id} className="icon-edit"><i className="iconfont">&#xe69e;</i></a>
                <div className="intro">
                    <a href="javascript:;" onClick={onDelete}><i className="iconfont">&#xe69d;</i></a>
                    <span className="time">{formatTime()}</span>
                </div>
            </div>
        );
    }
    return <div />;
}

class List extends PureComponent {
    constructor() {
        super();
        this.state = {
            docs: []
        };
    }
    componentDidMount() {
        apis.getDocs().then((docs = []) => {
            this.setState({
                docs
            });
        });
    }
    addCallback = (doc) => {
        const {docs} = this.state;
        this.setState({
            docs: docs.concat([doc])
        });
    }
    render() {
        const {docs} = this.state;
        return (
            <div>
                <AddModal
                    addCallback={this.addCallback}
                />
                <div className="docs">
                    {docs.map(d =>
                        <div className="item-wp" key={d._id}>
                            <DocItem
                                key={d._id}
                                doc={d}
                            />
                        </div>
                    )
                    }
                </div>
            </div>
        );
    }
}

export default List;