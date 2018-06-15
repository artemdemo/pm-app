export const createAction = (constant, actionFunc) => {
    const resultFunc = (...args) => {
        if (!actionFunc) {
            return {
                type: constant,
            };
        }
        const action = actionFunc(...args);
        return {
            type: constant,
            ...action,
        };
    };

    resultFunc.toString = () => constant;

    return resultFunc;
};
