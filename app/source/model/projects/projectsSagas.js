import { take, put } from 'redux-saga/effects';
import request from '../../services/request';
import * as projectsActions from './projectsActions';

function* loadProjectsSaga() {
    while (true) {
        try {
            yield take(`${projectsActions.loadProjects}`);
            const result = yield request
                .get('/api/projects')
                .promise();
            yield put(projectsActions.projectsLoaded(result.body));
        } catch (err) {
            yield put(projectsActions.projectsLoadingError(err));
        }
    }
}

function* loadSingleProjectSaga() {
    while (true) {
        try {
            const { id } = yield take(`${projectsActions.loadSingleProject}`);
            const result = yield request
                .get(`/api/projects/${id}`)
                .promise();
            yield put(singleProjectLoaded(result.body));
        } catch (err) {
            yield put(singleProjectsLoadingError(err));
        }
    }
}

function* addProjectSaga() {
    while (true) {
        try {
            const { project } = yield take(`${projectsActions.addProject}`);
            const result = yield request
                .post('/api/projects')
                .send(project)
                .promise();
            yield put(projectsActions.projectAdded(Object.assign(project, {id: result.body.id})));
        } catch (err) {
            yield put(projectsActions.projectAddingError(err));
        }
    }
}

function* updateProjectSaga() {
    while (true) {
        try {
            const { project } = yield take(`${projectsActions.updateProject}`);
            yield request
                .put('/api/projects')
                .send(project)
                .promise();
            yield put(projectsActions.projectUpdated(project));
        } catch (err) {
            yield put(projectsActions.projectUpdatingError(err));
        }
    }
}

function* deleteProjectSaga() {
    while (true) {
        try {
            const { id } = yield take(`${projectsActions.deleteProject}`);
            yield request
                .delete(`/api/projects/${id}`)
                .promise();
            yield put(projectsActions.projectDeleted(id));
        } catch (err) {
            yield put(projectsActions.projectDeletingError(err));
        }
    }
}

export default function* projectsSagas() {
    yield [
        loadProjectsSaga(),
        loadSingleProjectSaga(),
        addProjectSaga(),
        updateProjectSaga(),
        deleteProjectSaga(),
    ];
}
