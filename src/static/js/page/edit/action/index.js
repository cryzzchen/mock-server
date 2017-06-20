import {Promise} from 'es6-promise';

export const actionTypes = {
	updateBasicInfo: 'updateBasicInfo',
	updatePath: 'updatePath',
	updatePathParams: 'updatePathParams',
	updateQueryParams: 'updateQueryParams',
	updateBodyParams: 'updateBodyParams',
	updateResponseParams: 'updateResponseParams',
	deleteQueryParam: 'deleteQueryParam',
	addQueryParam: 'addQueryParam'
};

// 修改基本信息
const updateBasicInfo = (basicInfo, ownProps) => {
	return {
		type: actionTypes.updateBasicInfo,
		basicInfo
	};
}

// 修改Api路径
const updatePath = (basicInfo) => {
	return {
		type: actionTypes.updatePath,
		basicInfo
	}
}

// 修改路径参数
const updatePathParams = (pathParams, index) => {
	return {
		type: actionTypes.updatePathParams,
		pathParams,
		index
	}
}

// 修改请求参数
const updateQueryParams = (queryParams, index) => {
	return {
		type: actionTypes.updateQueryParams,
		index,
		queryParams
	}
}

// 删除一条Query参数
const deleteQueryParam = (index) => {
	return {
		type: actionTypes.deleteQueryParam,
		index
	}
}

// 新增一条Query参数
const addQueryParam = () => {
	return {
		type: actionTypes.addQueryParam
	}
}

// 修改body
const updateBodyParams = () => {

}

// 修改响应
const updateResponseParams = () => {

}

// 保存
const save = (ownProps) => {
	return (dispath, getState) => {
		const basicInfo = getState().basicInfo;
		const {path, query, body} = getState().parameters;
	}
}

export default {
	updateBasicInfo,
	updatePath,
	updatePathParams,
	updateQueryParams,
	deleteQueryParam,
	addQueryParam,
	updateBodyParams,
	updateResponseParams,
	save
};
