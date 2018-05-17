import authSagas from './model/auth/authSagas';
import boardsSagas from './model/boards/boardsSagas';
import projectsSagas from './model/projects/projectsSagas';
import settingsSagas from './model/settings/settingsSagas';
import tasksSagas from './model/tasks/tasksSagas';

export default function* rootSaga() {
    yield [
        authSagas(),
        boardsSagas(),
        projectsSagas(),
        settingsSagas(),
        tasksSagas(),
    ];
}
