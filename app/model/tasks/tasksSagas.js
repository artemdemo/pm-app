import { take, put } from 'redux-saga/effects';
import request from '../../services/request';
import * as tasksConst from './tasksConst';
import {
    tasksLoaded,
    tasksLoadingError,
    taskAdded,
    taskAddingError,
} from './tasksActions';

function* loadTasksSaga() {
    while (true) {
        try {
            yield take(tasksConst.LOAD_TASKS);
            const result = yield request
                .get('/api/tasks')
                .promise();
            yield put(tasksLoaded(result.body));
        } catch (err) {
            yield put(tasksLoadingError(err));
        }
    }
}

function* addTaskSaga() {
    while (true) {
        try {
            const { task } = yield take(tasksConst.ADD_TASK);
            const result = yield request
                .post('/api/tasks')
                .send(task)
                .promise();
            yield put(taskAdded(Object.assign({}, task, result.body)));
        } catch (err) {
            yield put(taskAddingError(err));
        }
    }
}

export default function* tasksSagas() {
    yield [
        loadTasksSaga(),
        addTaskSaga(),
    ];
}
