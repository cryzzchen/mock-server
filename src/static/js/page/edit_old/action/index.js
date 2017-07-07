import {Promise} from 'es6-promise';
import format from './format';
import apis from '../api/index';

export const actionTypes = {
    updateBasicInfo: 'updateBasicInfo',
    updatePath: 'updatePath',
    updatePathParams: 'updatePathParams',
    updateQueryParams: 'updateQueryParams',
    updateBodyParams: 'updateBodyParams',
    updateBodyItem: 'updateBodyItem',
    deleteBodyRow: 'deleteBodyRow',
    addBodyRow: 'addBodyRow',
    updateResponse: 'updateResponse',
    deleteResponseRow: 'deleteResponseRow',
    addResponseRow: 'addResponseRow',
    deleteQueryParam: 'deleteQueryParam',
    addQueryParam: 'addQueryParam',
    saveFail: 'saveFail',
    saveSucc: 'saveSucc',
    updatePageInfo: 'updatePageInfo',
    updateApiInfo: 'updateApiInfo',
    updateParametersInfo: 'updateParametersInfo'
};

// 修改基本信息
const updateBasicInfo = (basicInfo) => {
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

// 修改其他信息
const updateParametersInfo = (info) => {
    return {
        type: actionTypes.updateParametersInfo,
        info
    };
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
const addQueryParam = (index) => {
    return {
        type: actionTypes.addQueryParam,
        index
    }
}

// 修改body
const updateBodyParams = (body) => {
    return {
        type: actionTypes.updateBodyParams,
        body
    }
}

const updateBodyItem = (response, index) => {
    return {
        type: actionTypes.updateBodyItem,
        response,
        index
    }
}

const deleteBodyRow = (index) => {
    return {
        type: actionTypes.deleteBodyRow,
        index
    }
}

const addBodyRow = () => {
    return {
        type: actionTypes.addBodyRow
    }
}

// 修改响应
const updateResponse = (response, index) => {
    return {
        type: actionTypes.updateResponse,
        response,
        index
    }
}


const deleteResponseRow = (index) => {
    return {
        type: actionTypes.deleteResponseRow,
        index
    }
}

const addResponseRow = () => {
    return {
        type: actionTypes.addResponseRow
    }
}


const paths = location.pathname.split('/');
const docId = paths[paths.length - 1];

// 保存成功
const _saveSucc = () => {
    return {
        type: actionTypes.saveSucc
    };
};

// 保存失败
const _saveFail = (err) => {
    return {
        type: actionTypes.saveFail,
        err
    }
};

// 保存
const save = (ownProps) => {
    return (dispath, getState) => {
        const basicInfo = getState().basicInfo;
        const {path, query, body} = getState().parameters;
        const response = getState().response;
        // todo 状态码
        if (format({basicInfo, path, query, body}).v) {
            return apis.createApi({response, basicInfo, path, query, body}, {docid: docId}).then((data) => {
                dispath(_saveSucc());
            }, (err) => {
                dispath(_saveFail(err));
            });
        }
    }
}

const updateApiInfo = (apiId) => {
    return (dispath, getState) => {
        if (apiId) {
            if (apiId === 'addapi') {   // 新建
                dispath(updateBasicInfo({}));
                dispath(updateParametersInfo({path: [], query: [], body: {}}));
            } else {
                apis.getApi(apiId).then((result) => {
                    dispath(updateBasicInfo({...result[0].basicInfo}));
                    dispath(updateParametersInfo({
                        path: result[0].path,
                        query: result[0].query,
                        body: result[0].body
                    }));
                });
            }
        }
    }
}

const updatePageInfo = (apiId) => {
    return (dispath, getState) => {
        dispath(updateApiInfo(apiId));
        dispath({
            type: actionTypes.updatePageInfo,
            apiId
        })
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
    updateBodyItem,
    deleteBodyRow,
    addBodyRow,
    updateResponse,
    deleteResponseRow,
    addResponseRow,
    save,
    updatePageInfo,
    updateApiInfo,
    updateParametersInfo,
};
