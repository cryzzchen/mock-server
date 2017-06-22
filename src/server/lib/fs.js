import {Promise} from 'es6-promise';
import fs from 'fs';
import path from 'path';

const jsonRoot = path.resolve(__dirname, '../../../src/server/json');

const write = (content, docId, fileName) => {
    if (!fileName) {
        fileName = docId + '.json';
    }
    fs.writeFile(path.resolve(jsonRoot, './' + fileName), content, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('成功');
        }
    })
}

export default write;