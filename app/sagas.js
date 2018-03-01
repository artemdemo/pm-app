import boardsSagas from './model/boards/boardsSagas';
import projectsSagas from './model/projects/projectsSagas';

export default function* rootSaga() {
    yield [
        boardsSagas(),
        projectsSagas(),
    ];
}
