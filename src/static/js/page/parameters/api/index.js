import {Promise} from 'es6-promise';
import http from 'httpClient';

export default {
	getDocTree() {
		return http.get('/api/docs/get');
	},
	getParams() {
		return http.get('/api/params/get');
	},
	createParams(data) {
		return http.post('/api/params/create', data, {}, 'application/json;charset=UTF-8');
	},
	getDocs() {
		// 获得整个API文档
		return http.get('/api/docs/get');
	},
}
