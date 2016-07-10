// Isomorphic fetch docs: https://github.com/github/fetch
import fetch from 'isomorphic-fetch';
import domain from './domain';

/**
 * Fetching data from the server
 * @param url {String}
 * @param token {String}
 * @param params {Object}
 * @param host {String}
 * @example GET
 * fetch('/tasks/all', '23rdewww...').then((response) => {
 *     if (response.status >= 400) {
 *         throw new Error("Bad response from server");
 *     }
 *     return response.json();
 * })
 * @example POST
 * fetch('/tasks', '23rdewww...', { method: 'POST', body: {name: 'new task'} }).then((response) => {
 *     if (response.status >= 400) {
 *         throw new Error("Bad response from server");
 *     }
 *     return response.json();
 * })
 */
export default (url, token = null, params = {}, host = domain) => {
    let headers = {
        Accept: 'application/json',
    };

    if (token) {
        headers.authorization = token;
    }

    if (params.method && ['POST', 'PUT'].indexOf(params.method) > -1) {
        headers['Content-Type'] = 'application/json';
    }

    if (params.body && typeof params.body === 'object') {
        params.body = JSON.stringify(params.body);
    }

    return fetch(`${host}${url}`, Object.assign(
        {},
        {
            headers,
            credentials: 'same-origin',
        },
        params
    ));
};
