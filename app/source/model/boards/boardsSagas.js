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
            yield put(boardsActions.boardsLoaded(result.body));
        } catch (err) {
            yield put(boardsActions.boardsLoadingError(err));
        }
    }
}

function* addBoardSaga() {
    while (true) {
        try {
            const { board } = yield take(`${boardsActions.addBoard}`);
            const result = yield request
                .post('/api/boards')
                .send(board)
                .promise();
            yield put(boardsActions.boardAdded(Object.assign(board, {id: result.body.id})));
        } catch (err) {
            yield put(boardsActions.boardAddingError(err));
        }
    }
}

function* updateBoardSaga() {
    while (true) {
        try {
            const { board } = yield take(`${boardsActions.updateBoard}`);
            yield request
                .put('/api/boards')
                .send(board)
                .promise();
            // After updating single board I'll request all list, since their whole order could change
            // Therefore there is no additional data here from the request
            yield put(boardsActions.boardUpdated());
            yield put(boardsActions.loadBoards());
        } catch (err) {
            yield put(boardsActions.boardUpdatingError(err));
        }
    }
}

function* deleteBoardSaga() {
    while (true) {
        try {
            const { id } = yield take(`${boardsActions.deleteBoard}`);
            yield request
                .delete(`/api/boards/${id}`)
                .promise();
            yield put(boardsActions.boardDeleted(id));
        } catch (err) {
            yield put(boardsActions.boardDeletingError(err));
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
