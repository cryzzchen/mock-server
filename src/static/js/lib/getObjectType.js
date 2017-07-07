/*
* 判断类型
*/

let class2Type = {};
"Boolean Number String Function Array Date RegExp Object Error".split(" ").map((e) => {
	class2Type[`[object ${e}]`] = e.toLowerCase();
});

function getObjectType(obj) {
	if (obj === null) {
		return 'null';
	}
	if (typeof obj === 'object' || typeof obj === 'function') {
		return class2Type[class2Type.toString.call(obj)] || 'object';
	}
	return typeof obj;
}

export default getObjectType;