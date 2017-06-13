import React from 'react';
import {render} from 'react-dom';
import List from './container/list';
import Frame from '../../common/frame/index';

const div = document.createElement('div');
document.body.appendChild(div);

render(
	<Frame
		content={<List />}
	/>,
	div
);