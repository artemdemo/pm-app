import { take, put, all } from 'redux-saga/effects';
import request from '../../services/request';
import * as boardsActions from './boardsActions';

function* loadBoardsSaga() {
    while (true) {
        try {
            yield take(`${boardsActions.loadBoards}`);
            const result = yield request
                .get('/api/boards')
                .promise();
            yield put(boardsActions.loadBoardsResult(result.body));
        } catch (err) {
            yield put(boardsActions.loadBoardsResult(err));
        }
    }
}

function* addBoardSaga() {
    while (true) {
        try {
            const { payload } = yield take(`${boardsActions.addBoard}`);
            const result = yield request
                .post('/api/boards')
                .send(payload)
                .promise();
            yield put(boardsActions.addBoardResult(Object.assign(payload, {id: result.body.id})));
        } catch (err) {
            yield put(boardsActions.addBoardResult(err));
        }
    }
}

function* updateBoardSaga() {
    while (true) {
        try {
            const { payload } = yield take(`${boardsActions.updateBoard}`);
            yield request
                .put('/api/boards')
                .send(payload)
                .promise();
            // After updating single board I'll request all list, since their whole order could change
            // Therefore there is no additional data here from the request
            yield put(boardsActions.updateBoardResult());
            yield put(boardsActions.loadBoards());
        } catch (err) {
            yield put(boardsActions.updateBoardResult(err));
        }
    }
}

function* deleteBoardSaga() {
    while (true) {
        try {
            const { payload } = yield take(`${boardsActions.deleteBoard}`);
            yield request
                .delete(`/api/boards/${payload}`)
                .promise();
            yield put(boardsActions.deleteBoardResult(payload));
        } catch (err) {
            yield put(boardsActions.deleteBoardResult(err));
        }
    }
}

export default function* boardsSagas() {
    yield all([
        loadBoardsSaga(),
        addBoardSaga(),
        updateBoardSaga(),
        deleteBoardSaga(),
    ]);
}
