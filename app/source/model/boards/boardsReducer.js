import { createReducer } from 'redux-act';
import _isError from 'lodash/isError';
import * as boardsActions from './boardsActions';
import { sortByIdPosition } from '../../utils/boards';

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

const loadReducers = {
    [boardsActions.loadBoards]: (state) => ({
        ...state,
        loading: true,
    }),
    [boardsActions.loadBoardsResult]: (state, payload) => ({
        ...state,
        loading: false,
        data: _isError(payload) ? state.data : payload.sort(sortByIdPosition),
        loadingError: _isError(payload) ? payload : null,
    }),
};

const addReducers = {
    [boardsActions.addBoard]: (state) => ({
        ...state,
        adding: true,
    }),
    [boardsActions.addBoardResult]: (state, payload) => ({
        ...state,
        adding: false,
        data: _isError(payload) ? state.data : [
            ...state.data,
            payload,
        ],
        addingError: _isError(payload) ? payload : null,
    }),
};

const updateReducer = {
    [boardsActions.updateBoard]: (state) => ({
        ...state,
        updating: true,
    }),
    [boardsActions.updateBoardResult]: (state, payload) => ({
        // After updating single board I'll request all list, since they whole order could change
        ...state,
        updating: false,
        updatingError: _isError(payload) ? payload : null,
    }),
};

const deleteReducer = {
    [boardsActions.deleteBoard]: (state) => ({
        ...state,
        deleting: true,
    }),
    [boardsActions.deleteBoardResult]: (state, payload) => ({
        ...state,
        data: _isError(payload) ? state.data : state.data.filter(item => item.id !== payload),
        deleting: false,
        deletingError: _isError(payload) ? payload : null,
    }),
};

const resetReducer = {
    [boardsActions.resetBoards]: () => ({
        ...initState,
    }),
};

export default createReducer({
    ...loadReducers,
    ...addReducers,
    ...updateReducer,
    ...deleteReducer,
    ...resetReducer,
}, initState);
