/*
* 录入相关API
*/

import express from 'express';
import {middleLogger} from './common';
import path from 'path';

const router = express.Router();

router.get('/', (req, res) => {
	res.render(path.resolve(__dirname, '../../build/built-view/center'));
});

const prefix = '/doc/edit';

export {
	router,
	prefix
};