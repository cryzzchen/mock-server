import {combineReducers} from 'redux';
import {actionTypes} from '../action/index';


const basicInfo = (state = {}, action) => {
	switch (action.type) {
	case actionTypes.updateBasicInfo:
	case actionTypes.updatePath: {
		return Object.assign({}, state, action.basicInfo);
	}
	default: 
		return state;
	};
}

const parameters = (state = {path: [], query: [], body: []}, action) => {
	switch (action.type) {
	case actionTypes.updatePath: {
		const apiPath = action.basicInfo.path;
		const pattern = new RegExp('\\{(.| )+?\\}', 'g');
		const paths = apiPath.match(pattern) || [];

		return {
			...state,
			path: paths.map(path => {
				return path.substring(1, path.length - 1)
			})
		}
	}
	default:
		return state;
	};
}

export default combineReducers({
	basicInfo,
	parameters
});