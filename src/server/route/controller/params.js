import express from 'express';
import {queryTypes, dbHandler} from '../../db/index';

const router = express.Router();

router.post('/paramter/create', (req, res) => {
	dbHandler(queryTypes.createParams, req.query.docid, req.body).then((result) => {
		res.send(result);
	}, (err) => {
		res.send(err);
	})
});

router.get('/paramters/get', (req, res) => {
	dbHandler(queryTypes.getParams, req.query.docid).then((result) => {
		res.send(result);
	}, (err) => {
		res.send(err);
	});
})

router.get('/paramter/get', (req, res) => {
	dbHandler(queryTypes.getParam, req.query.id).then((result) => {
		res.send(result);
	}, (err) => {
		res.send(err);
	});
})

router.delete('/paramter/delete', (req, res) => {
	dbHandler(queryTypes.deleteParam, req.query.id).then((result) => {
		res.send(result);
	}, (err) => {
		res.send(err);
	});
});

router.put('/paramter/update', (req, res) => {
	dbHandler(queryTypes.updateParam, req.query.id, req.body).then((result) => {
		res.send(result);
	}, (err) => {
		res.send(err);
	});
})

export default router;