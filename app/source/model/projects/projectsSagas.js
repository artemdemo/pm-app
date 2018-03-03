import { take, put } from 'redux-saga/effects';
import request from '../../services/request';
import * as projectsConst from './projectsConst';
import {
    projectsLoaded,
    projectsLoadingError,
    projectAdded,
    projectAddingError,
    projectUpdated,
    projectUpdatingError,
    projectDeleted,
    projectDeletingError,
} from './projectsActions';

function* loadProjectsSaga() {
    while (true) {
        try {
            yield take(projectsConst.LOAD_PROJECTS);
            const result = yield request
                .get('/api/projects')
                .promise();
            yield put(projectsLoaded(result.body));
        } catch (err) {
            yield put(projectsLoadingError(err));
        }
    }
}

function* addProjectSaga() {
    while (true) {
        try {
            const { project } = yield take(projectsConst.ADD_PROJECT);
            const result = yield request
                .post('/api/projects')
                .send(project)
                .promise();
            yield put(projectAdded(Object.assign(project, {id: result.body.id})));
        } catch (err) {
            yield put(projectAddingError(err));
        }
    }
}

function* updateProjectSaga() {
    while (true) {
        try {
            const { project } = yield take(projectsConst.UPDATE_PROJECT);
            yield request
                .put('/api/projects')
                .send(project)
                .promise();
            yield put(projectUpdated(project));
        } catch (err) {
            yield put(projectUpdatingError(err));
        }
    }
}

function* deleteProjectSaga() {
    while (true) {
        try {
            const { id } = yield take(projectsConst.DELETE_PROJECT);
            yield request
                .delete(`/api/projects/${id}`)
                .promise();
            yield put(projectDeleted(id));
        } catch (err) {
            yield put(projectDeletingError(err));
        }
    }
}

export default function* projectsSagas() {
    yield [
        loadProjectsSaga(),
        addProjectSaga(),
        updateProjectSaga(),
        deleteProjectSaga(),
    ];
}
