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
    return (
        <div className="item">
            <h3>{doc.project_name}</h3>
            <div className="intro">
                <span>包含{doc.apis ? doc.apis.length : 0}个api</span>
                <span className="time">2014-1-2/12:20</span>
            </div>
        </div>
    );
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
    render() {
        const {docs} = this.state;
        return (
            <div>
                <AddModal />
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