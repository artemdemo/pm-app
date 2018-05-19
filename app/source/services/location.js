import history from '../history';

/**
 * `location` is wrapper for `history`
 * Here you can add additional changes for the url.
 * For example, if there is prefix url that can differ between environments
 */

export const push = (url) => {
    history.push(url);
};

export const replace = (url) => {
    history.replace(url);
};

export const goBack = () => {
    history.goBack();
};
