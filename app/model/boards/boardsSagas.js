import { take, put } from 'redux-saga/effects';
import request from 'superagent-bluebird-promise';
import * as boardsConst from './boardsConst';
import {
    boardsLoaded,
    boardsLoadingError,
    boardAdded,
    boardAddingError,
    boardUpdated,
    boardUpdatingError,
    boardDeleted,
    boardDeletingError,
} from './boardsActions';
import { getStoredToken } from '../../utils/user';

function* loadBoardsSaga() {
    while (true) {
        try {
            yield take(boardsConst.LOAD_BOARDS);
            const result = yield request
                .get('/api/boards')
                .set('authorization', getStoredToken())
                .promise();
            yield put(boardsLoaded(result.body));
        } catch (err) {
            yield put(boardsLoadingError(err));
        }
    }
}

function* addBoardSaga() {
    while (true) {
        try {
            const { board } = yield take(boardsConst.ADD_BOARD);
            const result = yield request
                .post('/api/boards')
                .set('authorization', getStoredToken())
                .send(board)
                .promise();
            yield put(boardAdded(Object.assign(board, {id: result.body.id})));
        } catch (err) {
            yield put(boardAddingError(err));
        }
    }
}

function* updateBoardSaga() {
    while (true) {
        try {
            const { board } = yield take(boardsConst.UPDATE_BOARD);
            const result = yield request
                .put('/api/boards')
                .set('authorization', getStoredToken())
                .send(board)
                .promise();
            yield put(boardUpdated(result.body));
        } catch (err) {
            yield put(boardUpdatingError(err));
        }
    }
}

function* deleteBoardSaga() {
    while (true) {
        try {
            const { id } = yield take(boardsConst.DELETE_BOARD);
            yield request
                .delete(`/api/boards/${id}`)
                .set('authorization', getStoredToken())
                .promise();
            yield put(boardDeleted(id));
        } catch (err) {
            yield put(boardDeletingError(err));
        }
    }
}

export default function* boardsSagas() {
    yield [
        loadBoardsSaga(),
        addBoardSaga(),
        updateBoardSaga(),
        deleteBoardSaga(),
    ];
}
