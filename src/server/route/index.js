import ejs from 'ejs';
import express from 'express';
import path from 'path';

import {LOG} from './common';

import apiRouters from './controller/index';
import pageRouters from './pageController/index';

const app = express();

const rootDir = path.resolve(__dirname, '../../../');

app.engine('html', ejs.__express);
app.set('views', path.join(rootDir, './src/views'));
app.set('view engine', 'html');

// 静态资源
app.use('/static', express.static(rootDir + '/src/static/js'));

// pageController
pageRouters.forEach((r) => {
	app.use(r);
});

// API Controller
apiRouters.forEach((r) => {
	app.use('/api', r);
});

// 启动
app.listen(3000, () => {
	LOG.info('Server on port 3000');
});