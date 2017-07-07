import React, {Component} from 'react';
import {Input, Button, Table, Select} from 'antd';
import getObjectType from '../../../../lib/getObjectType';

class Editor extends Component {
    format = () => {
        const content = this.refs.input.target.value;
        console.log(content);
        try {
            const json = JSON.parse(content);
            const type = getObjectType(json);
            if (type !== this.props.type) {
                throw("与设置的类型不符合");
            }
            this.refs.input.target.value = JSON.stringify(json);
            return json;
        } catch(e) {
            alert(e);
        }
    }
    getContent = () => {
        return this.format();
    }
    render() {
        return (
            <div>
                <Input ref="input" type="textarea" rows={4} />
                <Button onClick={this.format}>格式化</Button>
            </div>
        );
    }
}

export default Editor;