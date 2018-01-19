import boardsSagas from './model/boards/boardsSagas';

export default function* rootSaga() {
    yield [
        boardsSagas(),
    ];
}
