import {Promise} from 'es6-promise';
import http from 'httpClient';

export default {
	getDocs() {
		// 获得整个API文档
		return http.get('/api/docs/get');
	},
	createDoc(data) {
		return http.post('/api/doc/create', data, {}, 'application/json;charset=UTF-8');
	}
}
