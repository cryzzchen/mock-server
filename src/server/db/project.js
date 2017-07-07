import {Promise} from 'es6-promise';
import {DBRef, ObjectID} from 'mongodb';
import getLogger from '../lib/log';

const LOG = getLogger('mongodb');

const queryTypes = {
	getProjects: 'getProjects',
	createProject: 'createProject',
	setProjectIsMock: 'setProjectIsMock',
	deleteProject: 'deleteProject'
};

const projectCollection = 'projects';

const query = (() => {
	const getProjects = (db, userId) => {

		return new Promise((resolve, reject) => {
			db.collection(projectCollection).find({
				deleted: {$ne: 1},
				userId
			}).toArray((err, result) => {
				if (err) {
					LOG.error(err);
					reject(err);
				}
				resolve(result);
			});
		})
	}

	const createProject = (db, body, userId) => {
		return new Promise((resolve, reject) => {
			db.collection(projectCollection).insert({
				name: body.name,
				userId,
				description: body.desc,
				isMock: false,
				createdTime: new Date().getTime(),
				deleted: 0
			}, (err, result) => {
				if (err) {
					LOG.error(err);
					reject(err);
				}
				resolve(result.ops[0]);
			});
		});
	}

	const setProjectIsMock = (db, {projectId, isMock}) => {
		return new Promise((resolve, reject) => {
			db.collection(projectCollection).update({
				_id: ObjectID(projectId)
			}, {
				isMock,
				$currentDate: {
                    lastModified: true,
                    'cancellation.date': {
                        $type: 'timestamp'
                    }
                }
			}, (err, result) => {
				if (err) {
                    LOG.error(err);
                    reject(err);
                }
                resolve(err);
			});
		});
	}

	const deleteProject = (db, projectId) => {
		return new Promise((resolve, reject) => {
			db.collection(projectCollection).update({
				_id: ObjectID(projectId)
			}, {
				$set: {deleted: 1},
				$currentDate: {
                    lastModified: true,
                    'cancellation.date': {
                        $type: 'timestamp'
                    }
                }
			}, (err, result) => {
				if (err) {
                    LOG.error(err);
                    reject(err);
                }
                resolve(err);
			});
		});
	}

	return {
		getProjects,
		createProject,
		setProjectIsMock,
		deleteProject
	}
})();

export {
	queryTypes,
	query
};