import { take, put } from 'redux-saga/effects';
import request from '../../services/request';
import * as boardsConst from './boardsConst';
import {
    loadBoards,
    boardsLoaded,
    boardsLoadingError,
    boardAdded,
    boardAddingError,
    boardUpdated,
    boardUpdatingError,
    boardDeleted,
    boardDeletingError,
} from './boardsActions';

function* loadBoardsSaga() {
    while (true) {
        try {
            yield take(boardsConst.LOAD_BOARDS);
            const result = yield request
                .get('/api/boards')
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
            yield request
                .put('/api/boards')
                .send(board)
                .promise();
            // After updating single board I'll request all list, since they whole order could change
            // Therefore there is no additional data here from the request
            yield put(boardUpdated());
            yield put(loadBoards());
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
