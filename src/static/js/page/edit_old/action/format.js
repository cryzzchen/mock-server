/*
* 转化成yaml格式
*/

// const _generatePathYaml = ({basicInfo, path, query, body}) => {
//     const _generateQuery = ({basicInfo, path, query, body}, prefix) => {
//         return prefix + '- name: size\n' +
//                prefix + '  in: query\n' +
//                prefix + '  description: 这里是测试\n' +
//                prefix + '  type: integer\n';
//     }

//     const _generateParameters = (data, prefix) => {
//         return prefix + 'parameters:\n' +
//                 _generateQuery(data, prefix);
//     }

//     const _generateResponse = (data, prefix) => {
//         return prefix + 'responses:\n' +
//                prefix + '  200:\n' +
//                prefix + '    description: A list of test\n' +
//                prefix + '    schema:\n' +
//                prefix + '      type: array\n' +
//                prefix + '      items:\n' +
//                prefix + '        required:\n' +
//                prefix + '          - username\n' +
//                prefix + '        properties:\n' +
//                prefix + '          username:\n' +
//                prefix + '            type: string\n' +
//                prefix + '          firstname:\n' +
//                prefix + '            type: string\n';
//     }


//     const _generatePath = ({basicInfo, path, query, body}, prefix) => {
//         return prefix + `${basicInfo.path}:\n` +
//                prefix + `  ${basicInfo.method}:\n` +
//                prefix + `    summary: ${basicInfo.name}\n` +
//                prefix + `    description: ${basicInfo.description && ''}\n` +
//                _generateResponse({basicInfo, path, query, body}, prefix + '    ') +
//                _generateParameters({basicInfo, path, query, body}, prefix + '    ');
//     }

//     // todo 循环
//     return 'paths:\n' + _generatePath({basicInfo, path, query, body}, '  ');
// }


const _checkValid = ({basicInfo, path, query, body}) => {
    // 必填项是否都有
    if (!basicInfo.name) {
        return {
            m: '请填入接口名称',
            v: false
        };
    }
    if (!basicInfo.contentType) {
        return {
            m: '请选择ContentType',
            v: false
        };
    }
    if (!basicInfo.path) {
        return {
            m: '请输入路径',
            v: false
        };
    }
    if (!basicInfo.subService) {
        return {
            m: '请选择子服务',
            v: false
        };
    }

    return {
        m: '正确',
        v: true
    };
}

const format = ({basicInfo, path, query, body}) => {
    const isValid = _checkValid({basicInfo, path, query, body});

    return isValid;
}

export default format;
