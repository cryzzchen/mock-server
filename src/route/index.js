import {prefix as editPrefix, router as editRouter} from './edit';
import ejs from 'ejs';
import express from 'express';
import {LOG} from './common'

const app = express();

app.engine('html', ejs.__express);
app.set('view engine', 'html');

// 静态资源
app.use('/static', express.static(__dirname + '../../build/static'));

app.use(editPrefix, editRouter);



// 启动
app.listen(3000, () => {
	LOG.info('Server on port 3000');
});