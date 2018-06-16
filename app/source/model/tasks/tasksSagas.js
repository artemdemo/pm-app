import { take, put } from 'redux-saga/effects';
import request from '../../services/request';
import * as tasksActions from './tasksActions';

function* loadTasksSaga() {
    while (true) {
        try {
            yield take(`${tasksActions.loadTasks}`);
            const result = yield request
                .get('/api/tasks')
                .promise();
            yield put(tasksActions.tasksLoaded(result.body));
        } catch (err) {
            yield put(tasksActions.tasksLoadingError(err));
        }
    }
}

function* loadSingleTaskSaga() {
    while (true) {
        try {
            const { id } = yield take(`${tasksActions.loadSingleTask}`);
            const result = yield request
                .get(`/api/tasks/${id}`)
                .promise();
            yield put(tasksActions.singleTaskLoaded(result.body));
        } catch (err) {
            yield put(tasksActions.singleTasksLoadingError(err));
        }
    }
}

function* addTaskSaga() {
    while (true) {
        try {
            const { task } = yield take(`${tasksActions.addTask}`);
            const result = yield request
                .post('/api/tasks')
                .send(task)
                .promise();
            yield put(tasksActions.taskAdded(result.body));
        } catch (err) {
            yield put(tasksActions.taskAddingError(err));
        }
    }
}

function* updateTaskSaga() {
    while (true) {
        try {
            const { task } = yield take(`${tasksActions.updateTask}`);
            const result = yield request
                .put('/api/tasks')
                .send(task)
                .promise();
            yield put(tasksActions.taskUpdated(result.body));
        } catch (err) {
            yield put(tasksActions.taskUpdatingError(err));
        }
    }
}

function* deleteTaskSaga() {
    while (true) {
        try {
            const { id } = yield take(`${tasksActions.deleteTask}`);
            yield request
                .delete(`/api/tasks/${id}`)
                .promise();
            yield put(tasksActions.taskDeleted(id));
        } catch (err) {
            yield put(tasksActions.taskDeletingError(err));
        }
    }
}

function* updateTaskPositionSaga() {
    while (true) {
        try {
            const { draggedTask, boardId, nearTaskId, position } = yield take(`${tasksActions.updateTaskPosition}`);
            yield request
                .put('/api/tasks/position')
                .send({
                    taskId: draggedTask.id,
                    nearTaskId,
                    position,
                    boardId,
                })
                .promise();
            yield put(tasksActions.taskPositionUpdated());
        } catch (err) {
            yield put(tasksActions.taskPositionUpdateError(err));
        }
    }
}

export default function* tasksSagas() {
    yield [
        loadTasksSaga(),
        loadSingleTaskSaga(),
        addTaskSaga(),
        updateTaskSaga(),
        deleteTaskSaga(),
        updateTaskPositionSaga(),
    ];
}
