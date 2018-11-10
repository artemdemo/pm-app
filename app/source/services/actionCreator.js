export const createAction = (constant, actionFunc) => {
    const resultFunc = (...args) => {
        if (!actionFunc) {
            return {
                type: constant,
            };
        }
        const action = actionFunc(...args);
        return {
            ...action,
            // The whole point of this helper service is to reduce boilerplate
            // User should not be able to change `type`
            // This way I can make tests easier
            type: constant,
        };
    };

    resultFunc.toString = () => constant;

    return resultFunc;
};
