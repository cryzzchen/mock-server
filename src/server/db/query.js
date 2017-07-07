import {query as docsQuery, queryTypes as docsQueryTypes} from './docs';
import {query as projectQuery, queryTypes as projectQueryTypes} from './project';


const query = Object.assign({}, docsQuery, projectQuery);
const queryTypes = Object.assign({}, docsQueryTypes, projectQueryTypes);

export {
    query,
    queryTypes
}