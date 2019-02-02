export const __cancel = jest.fn();

let responseBody = null;
let useResponseBody = false;
export const __setBodyForNextResponse = (body) => {
    responseBody = body;
    useResponseBody = true;
};

function promise() {
    if (useResponseBody) {
        useResponseBody = false;
        return Promise.resolve({body: responseBody});
    }
    return Promise.resolve();
}

promise.cancel = __cancel;

export const __query = jest.fn(() => ({
    promise,
}));

export const __send = jest.fn(() => ({
    promise,
}));

export const __set = jest.fn(() => ({
    promise,
}));

let shouldThrow = false;
export const __throwNextRequest = () => {
    shouldThrow = true;
};

const request = {
    get: jest.fn(() => {
        if (shouldThrow) {
            shouldThrow = false;
            throw new Error();
        }
        return {
            query: __query,
            set: __set,
        };
    }),
    'delete': jest.fn(() => {
        if (shouldThrow) {
            shouldThrow = false;
            throw new Error();
        }
        return {
            promise,
            set: __set,
        };
    }),
    post: jest.fn(() => {
        if (shouldThrow) {
            shouldThrow = false;
            throw new Error();
        }
        return {
            send: __send,
        };
    }),
    put: jest.fn(() => {
        if (shouldThrow) {
            shouldThrow = false;
            throw new Error();
        }
        return {
            send: __send,
        };
    }),
};

export default request;
