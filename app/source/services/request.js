import request from 'superagent-bluebird-promise';
import * as token from '../services/token';

export default {
    get: (url) => {
        const tokenInstance = token.get();
        return request
            .get(url)
            .set('authorization', `Bearer ${tokenInstance.token}`);
    },
    post: (url) => {
        const tokenInstance = token.get();
        return request
            .post(url)
            .set('authorization', `Bearer ${tokenInstance.token}`);
    },
    put: (url) => {
        const tokenInstance = token.get();
        return request
            .put(url)
            .set('authorization', `Bearer ${tokenInstance.token}`);
    },
    'delete': (url) => {
        const tokenInstance = token.get();
        return request
            .delete(url)
            .set('authorization', `Bearer ${tokenInstance.token}`);
    },
};
