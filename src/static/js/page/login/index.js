import Frame from '../../common/frame/index';
import React, {Component} from 'react';
import {render} from 'react-dom';
import {Input, Button} from 'antd';
import http from 'httpClient';


const div = document.createElement('div');
document.body.appendChild(div);

class App extends Component {
    state = {
        name: '',
        pswd: ''
    }
    onChange = (obj) => {
        this.setState(obj);
    }
    login = () => {
        const {name, pswd} = this.state;
        http.post('/api/user/login', {
            name,
            pswd
        }).then(() => {
            console.log('登录成功')
        }, (e) => {
            console.log(e);
        })
    }
    render() {
        return (
            <div className="login-wp">
                <Input onChange={(e) => this.onChange({name: e.target.value})} placeholder="花名" />
                <Input onChange={(e) => this.onChange({pswd: e.target.value})} placeholder="密码" />
                <Button onClick={this.login}>登录</Button>
            </div>
        );
    }
}

render(
    <Frame
        content={<App />}
    />,
    div
);