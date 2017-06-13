import React from 'react';
import {render} from 'react-dom';
import ApiEdit from './container/apiEdit';
import Frame from '../../common/frame/index';

const div = document.createElement('div');
document.body.appendChild(div);

render(
	<Frame
		content={<ApiEdit />}
	/>,
	div
);