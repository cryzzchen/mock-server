const glob = require('glob');

const files = glob.sync('./src/static/js/**/index.js');
console.log(files.map((file) => {
	console.log(file);
	const entryName = file.replace('./src/static/js/', '').replace('/index.js', '');
	return entryName;
}));

