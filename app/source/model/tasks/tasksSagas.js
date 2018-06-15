import { take, put } from 'redux-saga/effects';
import request from '../../services/request';
import {
    loadTasks,
    tasksLoaded,
    tasksLoadingError,
    loadSingleTask,
    singleTaskLoaded,
    singleTasksLoadingError,
    addTask,
    taskAdded,
    taskAddingError,
    updateTask,
    taskUpdated,
    taskUpdatingError,
    deleteTask,
    taskDeleted,
    taskDeletingError,
    taskPositionUpdated,
    taskPositionUpdateError,
    updateTaskPosition,
} from './tasksActions';

function* loadTasksSaga() {
    while (true) {
        try {
            yield take(`${loadTasks}`);
            const result = yield request
                .get('/api/tasks')
                .promise();
            yield put(tasksLoaded(result.body));
        } catch (err) {
            yield put(tasksLoadingError(err));
        }
    }
}

function* loadSingleTaskSaga() {
    while (true) {
        try {
            const { id } = yield take(`${loadSingleTask}`);
            const result = yield request
                .get(`/api/tasks/${id}`)
                .promise();
            yield put(singleTaskLoaded(result.body));
        } catch (err) {
            yield put(singleTasksLoadingError(err));
        }
    }
}

function* addTaskSaga() {
    while (true) {
        try {
            const { task } = yield take(`${addTask}`);
            const result = yield request
                .post('/api/tasks')
                .send(task)
                .promise();
            yield put(taskAdded(result.body));
        } catch (err) {
            yield put(taskAddingError(err));
        }
    }
}

function* updateTaskSaga() {
    while (true) {
        try {
            const { task } = yield take(`${updateTask}`);
            const result = yield request
                .put('/api/tasks')
                .send(task)
                .promise();
            yield put(taskUpdated(result.body));
        } catch (err) {
            yield put(taskUpdatingError(err));
        }
    }
}

function* deleteTaskSaga() {
    while (true) {
        try {
            const { id } = yield take(`${deleteTask}`);
            yield request
                .delete(`/api/tasks/${id}`)
                .promise();
            yield put(taskDeleted(id));
        } catch (err) {
            yield put(taskDeletingError(err));
        }
    }
}

function* updateTaskPositionSaga() {
    while (true) {
        try {
            const { draggedTask, boardId, nearTaskId, position } = yield take(`${updateTaskPosition}`);
            yield request
                .put('/api/tasks/position')
                .send({
                    taskId: draggedTask.id,
                    nearTaskId,
                    position,
                    boardId,
                })
                .promise();
            yield put(taskPositionUpdated());
        } catch (err) {
            yield put(taskPositionUpdateError(err));
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
