import fetch from 'node-fetch';
import {Promise} from 'es6-promise';

const login = ({name, pswd}) => {
	return fetch('http://10.1.13.239/authnet/open/api/auth', {
		method: 'POST',
		body: JSON.stringify({
			uid: name,
			pswd
		}),
		headers: {'Content-Type': 'application/json'}
	}).then((res) => {
		return res.json();
	});
}

const createSession = () => {

}

export {
	login,
	createSession
};