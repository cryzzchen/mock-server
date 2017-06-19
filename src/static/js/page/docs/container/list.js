/*
* 文档列表
*/

import React, {PureComponent} from 'react';
import {Table, Row, Col} from 'antd';

import apis from '../api/index';
import AddModal from './addModal';
import './list.scss';

const DocItem = ({doc}) => {
    const onClick = () => {

    }
    if (doc.name) {
        return (
            <div className="item">
                <h3>{doc.name}</h3>
                <a href={'/doc/edit/' + doc._id} className="icon-edit"><i className="iconfont">&#xe69e;</i></a>
                <div className="intro">
                    <span>包含{doc.apis ? doc.apis.length : 0}个api</span>
                    <span className="time">2014-1-2/12:20</span>
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
                        <div className="item-wp">
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