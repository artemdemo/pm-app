/* eslint-disable strict*/
'use strict';

const helper = require('./helper');
const user = {};

const getUserData = (userId) => {
    if (!user[userId]) {
        const username = helper.getRandomWord(10);
        user[userId] = {
            username,
            email: username + '@' + helper.getRandomWord(5) + '.' + helper.getRandomWord(3),
            password: helper.getRandomWord(10),
        };
    }
    return user[userId];
};

module.exports = {
    getUserData,
};
