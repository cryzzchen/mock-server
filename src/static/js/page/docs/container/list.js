/*
* 文档列表
*/

import React, {PureComponent} from 'react';
import {Table} from 'antd';

import apis from '../api/index';
import './list.scss';

const DocItem = ({doc}) => {
    console.log(doc);
    return (
        <li>
            <div className="intro">
                <h3>{doc.project_name}</h3>
                <span>包含{doc.apis.length}个api</span>
                <span>上次修改时间</span>
            </div>
            {
                doc.apis && doc.apis.length > 0 &&
                <div className="apis" />
            }
        </li>
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
            console.log(docs);
            this.setState({
                docs
            });
        });
    }
    render() {
        const {docs} = this.state;
        return (
            <ul className="docs">
                {docs.map(d => 
                    <DocItem
                        key={d._id}
                        doc={d}
                    />
                )
                }
             </ul>
        );
    }
}

export default List;