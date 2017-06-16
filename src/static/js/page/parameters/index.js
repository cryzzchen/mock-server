import React from 'react';
import {render} from 'react-dom';

import Frame from '../../common/frame/index';
import App from './container/index';

const div = document.createElement('div');
document.body.appendChild(div);

render(
	<Frame
		content={<App />}
	/>,
	div
);