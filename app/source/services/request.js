import request from 'superagent-bluebird-promise';
import { getStoredToken } from '../utils/user';

export default {
    get: (url) => {
        return request
            .get(url)
            .set('authorization', `Bearer ${getStoredToken()}`);
    },
    post: (url) => {
        return request
            .post(url)
            .set('authorization', `Bearer ${getStoredToken()}`);
    },
    put: (url) => {
        return request
            .put(url)
            .set('authorization', `Bearer ${getStoredToken()}`);
    },
    'delete': (url) => {
        return request
            .delete(url)
            .set('authorization', `Bearer ${getStoredToken()}`);
    },
};
