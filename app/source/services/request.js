import request from 'superagent-bluebird-promise';

const defaultHeaders = {};

export const setDefaultHeader = (name, value) => {
    defaultHeaders[name] = value;
};

export const clearDefaultHeaders = () => {
    const keys = Object.keys(defaultHeaders);
    keys.forEach(key => delete defaultHeaders[key]);
};

const applyHeaders = (request) => {
    if (Object.keys(defaultHeaders).length > 0) {
        for (const key in defaultHeaders) {
            request.set(key, defaultHeaders[key]);
        }
    }
    return request;
};

export default {
    get: (url) => {
        const requestHandler = request.get(url);
        return applyHeaders(requestHandler);
    },
    post: (url) => {
        const requestHandler = request.post(url);
        return applyHeaders(requestHandler);
    },
    put: (url) => {
        const requestHandler = request.put(url);
        return applyHeaders(requestHandler);
    },
    'delete': (url) => {
        const requestHandler = request.delete(url);
        return applyHeaders(requestHandler);
    },
};
