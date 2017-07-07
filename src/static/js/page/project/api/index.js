import {Promise} from 'es6-promise';
import http from 'httpClient';

export default {
    getDocs() {
        return http.get('/api/project/get');
    },
    createDoc(data) {
        return http.post('/api/project/create', data, {}, 'application/json;charset=UTF-8');
    },
    deleteDoc(data) {
        return http.delete('/api/project/delete/' + data);
    }
}
