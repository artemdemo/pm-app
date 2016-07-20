import * as boardsConst from '../constants/boards';
import { errorMessage } from './notification';
import { getStoredToken } from '../utils/user';
import fetch from '../utils/fetch';
import checkResponseStatus from '../utils/checkResponseStatus';

function boardsLoaded(boards) {
    return {
        type: boardsConst.BOARDS_LOADED,
        boards,
    };
}

export function loadBoards() {
    const token = getStoredToken();

    return dispatch => {
        fetch('/boards/all', token)
            .then(checkResponseStatus)
            .then((response) => {
                return response.json();
            })
            .then((boards) => {
                dispatch(boardsLoaded(boards));
            })
            .catch((e) => {
                console.error(e);
                dispatch(errorMessage('Error, while boards loading'));
            });
    };
}
