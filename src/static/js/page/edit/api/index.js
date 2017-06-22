import {Promise} from 'es6-promise';
import http from 'httpClient';

export default {
    getDocsById(id, level = 1) {
        return http.get('/api/docs/get', {id, level});
    },
    createDoc(data) {
        return http.post('/api/doc/create', data, {}, 'application/json;charset=UTF-8');
    },
	createApi(data, query) {
		return http.post('/api/doc/api/create', data, query, 'application/json;charset=UTF-8')
	},
	getApisByDocId(id) {
		return http.get('/api/doc/api/get?docid=' + id);
	}
}