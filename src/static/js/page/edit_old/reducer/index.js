import {combineReducers} from 'redux';
import {actionTypes} from '../action/index';

const isEmpty = (obj) => {
	for (let name in obj) {
		return false;
	}
	return true;
}

const basicInfo = (state = {}, action) => {
	switch (action.type) {
	case actionTypes.updateBasicInfo:
	case actionTypes.updatePath: {
		if (isEmpty(action.basicInfo)) {
			return {};
		}
		return Object.assign({}, state, action.basicInfo);
	}
	default: 
		return state;
	};
}

// body暂时只考虑array和object的情况
const parameters = (state = {path: [], query: [], body: {}}, action) => {
	switch (action.type) {
	case actionTypes.updatePath: {
		const apiPath = action.basicInfo.path;
		const pattern = new RegExp('\\{(.| )+?\\}', 'g');
		const paths = apiPath.match(pattern) || [];

		return {
			...state,
			path: paths.map(path => {
				return {
					name: path.substring(1, path.length - 1),
					required: 'true'
				};
			})
		}
	}
	case actionTypes.updatePathParams: {
		const path = state.path.concat([]);
		path[action.index] = Object.assign({}, path[action.index], action.pathParams);
		return {
			...state,
			path
		};
	}
	case actionTypes.updateQueryParams: {
		const query = state.query.concat([]);
		query[action.index] = Object.assign({}, query[action.index], action.queryParams);
		return {
			...state,
			query
		};
	}
	case actionTypes.updateBodyParams: {
		return {
			...state,
			body: action.body
		}
	}
	case actionTypes.updateBodyItem: {
		const now = Object.assign({}, state.body);
		now.items[action.index] = Object.assign({}, now.items[action.index], action.response);
		
		return {
			...state,
			body: now
		};
	}
	case actionTypes.deleteBodyRow: {
		const now = Object.assign({}, state.body);
		delete now.items[action.index];
		return {
			...state,
			body: now
		};
	}
	case actionTypes.addBodyRow: {
		const now = Object.assign({}, state.body);
		now.items.push({});
		return {
			...state,
			body: now
		};
	}
	case actionTypes.deleteQueryParam: {
		let query = state.query.concat([]);
		query.splice(action.index, 1);
		return {
			...state,
			query
		};
	}
	case actionTypes.addQueryParam: {
		let query = state.query.concat([]);
		query.push({index: action.index});

		return {
			...state,
			query
		};
	}
	case actionTypes.updateParametersInfo: {
		return {
			...state,
			...action.info
		}
	}
	default:
		return state;
	};
}

const response = (state = [{name: 200}], action) => {
	switch(action.type) {
	case actionTypes.updateResponse: {
		const now = state.concat([]);

		now[action.index] = {
			...now[action.index],
			...action.response
		}
		return now;
	}
	case actionTypes.deleteResponseRow: {
		const now = state.concat([]);

		delete now[action.index];
		return now;
	}
	case actionTypes.addResponseRow: {
		const now = state.concat([]);

		now.push({});
		return now;
	}
	default:
		return state;
	}
}

const save = (state = {saveStatus: 0}, action) => {
	switch(action.type) {
	case actionTypes.saveFail: {
		return {
			err: action.err,
			saveStatus: -1
		};
	}
	case actionTypes.saveSuc: {
		return {
			saveStatus: 1
		}
	}
	default:
		return {
			saveStatus: 0
		};
	}
}

const paths = location.pathname.split('/');
const docId = paths[paths.length - 1];
let apiId = '';
const hash = location.hash;
if (hash && hash.length > 1) {
	apiId = hash.substring(1, hash.length);
}

const pageInfo = (state = {docId, apiId}, action) => {
	switch(action.type) {
	case actionTypes.updatePageInfo: {
		return {
			...state,
			...action.info
		}
	}
	default: 
		return state;
	}
}

export default combineReducers({
	basicInfo,
	parameters,
	save,
	pageInfo,
	response
});