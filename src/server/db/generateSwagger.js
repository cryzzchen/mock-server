import {DBRef, ObjectID} from 'mongodb';
import {Promise} from 'es6-promise';
import yamljs from 'yamljs';

import {queryTypes, dbHandler} from './index';
import generateYaml from '../lib/yamlTemplate';
import write from '../lib/fs';

const generateSwagger = (docId) => {
	Promise.all([
		dbHandler(queryTypes.getApis, {docid: new DBRef(ObjectID(docId))}),
		dbHandler(queryTypes.getDocs, {_id: ObjectID(docId)})
	]).then((result) => {
		const apis = result[0];
		const docInfo = result[1][0];

		const yaml = generateYaml(docInfo, apis);
		write(yaml, docId, docId + '.yaml');
		// 转化成json

		const json = yamljs.parse(yaml);
		write(JSON.stringify(json), docId);
	});
}

export default generateSwagger;