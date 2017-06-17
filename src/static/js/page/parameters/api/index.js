import {Promise} from 'es6-promise';
import http from 'httpClient';

export default {
	getDocTree() {
		return http.get('/api/get/docs');
	},
	getParams() {
		return http.get('/api/params');
	},
	createParams(data) {
		return http.post('/api/params/create', data, {}, 'application/json;charset=UTF-8');
	}
}
