import * as actions from '../boardsActions';
import reducer from '../boardsReducer';

const initState = {
    data: [],
    loading: false,
    loadingError: null,
    updating: false,
    updatingError: null,
    adding: false,
    addingError: null,
    deleting: false,
    deletingError: null,
};

describe('boardsReducer', () => {
    it('should return initState', () => {
        expect(reducer()).toEqual(initState);
    });
    describe('loadReducers', () => {
        it('login', () => {
            expect(reducer(initState, actions.loadBoards()))
                .toEqual({
                    ...initState,
                    loading: true,
                });
        });
        describe('loadBoardsResult', () => {
            const board1 = { id_position: 1 };
            const board2 = { id_position: 2 };
            const data = [
                board2,
                board1,
            ];
            const state = {
                ...initState,
                loading: true,
            };

            it('data', () => {
                const payload = actions.loadBoardsResult(data);
                expect(reducer(state, payload))
                    .toEqual({
                        ...initState,
                        data: [
                            board1,
                            board2,
                        ],
                        loading: false,
                        loadingError: null,
                    });
            });

            it('error', () => {
                const err = new Error(data.message);
                const payload = actions.loadBoardsResult(err);
                expect(reducer(state, payload))
                    .toEqual({
                        ...initState,
                        loading: false,
                        loadingError: err,
                    });
            });
        });
    });

    describe('addReducers', () => {
        it('addBoard', () => {
            expect(reducer(initState, actions.addBoard()))
                .toEqual({
                    ...initState,
                    adding: true,
                });
        });
        describe('addBoardResult', () => {
            const board = {
                id: '1',
                name: 'some board'
            };
            const state = {
                ...initState,
                adding: true,
            };

            it('data', () => {
                const payload = actions.addBoardResult(board);
                expect(reducer(state, payload))
                    .toEqual({
                        ...initState,
                        data: [
                            board,
                        ],
                        adding: false,
                        addingError: null,
                    });
            });

            it('error', () => {
                const err = new Error('some error');
                const payload = actions.addBoardResult(err);
                expect(reducer(state, payload))
                    .toEqual({
                        ...initState,
                        adding: false,
                        addingError: err,
                    });
            });
        });
    });

    describe('updateReducer', () => {
        it('updateBoard', () => {
            expect(reducer(initState, actions.updateBoard()))
                .toEqual({
                    ...initState,
                    updating: true,
                });
        });
        describe('updateBoardResult', () => {
            const data = {
                message: 'Some data',
            };
            const state = {
                ...initState,
                updating: true,
            };

            it('data', () => {
                const payload = actions.updateBoardResult(data);
                expect(reducer(state, payload))
                    .toEqual({
                        ...initState,
                        updating: false,
                        updatingError: null,
                    });
            });

            it('error', () => {
                const err = new Error(data.message);
                const payload = actions.updateBoardResult(err);
                expect(reducer(state, payload))
                    .toEqual({
                        ...initState,
                        updating: false,
                        updatingError: err,
                    });
            });
        });
        it('should reset boards', () => {
            const state = {
                ...initState,
                data: { message: 'Prev data' },
                loading: true,
            };
            expect(reducer(state, actions.resetBoards()))
                .toEqual({
                    ...initState,
                });
        });
    });
    describe('deleteReducer', () => {
        it('deleteBoard', () => {
            expect(reducer(initState, actions.deleteBoard()))
                .toEqual({
                    ...initState,
                    deleting: true,
                });
        });
        describe('deleteBoardResult', () => {
            const board1 = { id: 1, name: 'board 1' };
            const board2 = { id: 2, name: 'board 2' };
            const state = {
                ...initState,
                data: [
                    board1,
                    board2,
                ],
                deleting: true,
            };

            it('data', () => {
                const payload = actions.deleteBoardResult(board1.id);
                expect(reducer(state, payload))
                    .toEqual({
                        ...initState,
                        data: [
                            board2,
                        ],
                        deleting: false,
                        deletingError: null,
                    });
            });

            it('error', () => {
                const err = new Error('Some error');
                const payload = actions.deleteBoardResult(err);
                expect(reducer(state, payload))
                    .toEqual({
                        ...initState,
                        data: [
                            board1,
                            board2,
                        ],
                        deleting: false,
                        deletingError: err,
                    });
            });
        });
    });
});
