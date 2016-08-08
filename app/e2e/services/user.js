/* eslint-disable strict*/
'use strict';

const helper = require('./helper');
let user = null;

const getUserData = () => {
    if (!user) {
        const username = helper.getRandomWord(10);
        user = {
            username,
            email: username + '@' + helper.getRandomWord(5) + '.' + helper.getRandomWord(3),
            password: helper.getRandomWord(10),
        };
    }
    return user;
};

module.exports = {
    getUserData,
};
