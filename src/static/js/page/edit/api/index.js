import {Promise} from 'es6-promise';
import http from 'httpClient';

export default {
    getDocsById(id, level = 1) {
        return http.get('/api/docs/get', {id, level});
    },
    createDoc(data) {
        return http.post('/api/doc/create', data, {}, 'application/json;charset=UTF-8');
    }
}