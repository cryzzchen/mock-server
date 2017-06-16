import {Promise} from 'es6-promise';

export const actionTypes = {
	updateBasicInfo: 'updateBasicInfo',
	updatePath: 'updatePath'
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

export default {
	updateBasicInfo,
	updatePath
};
