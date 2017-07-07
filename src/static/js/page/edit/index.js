// import React from 'react';
// import {render} from 'react-dom';
// import {createStore, applyMiddleware} from 'redux';
// import {Provider} from 'react-redux';
// import thunk from 'redux-thunk';

// import reducers from './reducer/index';
// import Frame from '../../common/frame/index';
// import App from './container/index';

// const div = document.createElement('div');
// document.body.appendChild(div);

// const middleware = [thunk];

// const store = createStore(
//     reducers,
//     applyMiddleware(...middleware)
// );

// render(
//     <Provider store={store}>
//         <Frame
//             content={<App />}
//         />
//     </Provider>,
//     div
// );