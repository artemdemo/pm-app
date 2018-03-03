/* eslint-disable max-len */
const loadModule = require('../../test-suite/loadModule');

const DBMock = {
    queryRows: (query, [tokenId]) => Promise.resolve({
        query,
        tokenId,
    }),
};

const dbUtil = loadModule('./utils/db.js', {
    'sqlite-crud': DBMock,
});

describe('DB utils', () => {
    it('should throw error if fields are not array', (done) => {
        dbUtil.queryRowsWithSession({
            tableName: 'tableName',
        })
            .catch((e) => {
                expect(e.message).toBe('`fields` should be array');
                done();
            });
    });

    it('should create query to "tasks" table', (done) => {
        const customToken = 'token1234';
        dbUtil.queryRowsWithSession({
            tableName: 'tasks',
            fields: ['id', 'name'],
            tokenId: customToken,
        })
            .then(({query, tokenId}) => {
                expect(query.replace(/\s+/g, ' '))
                    .toBe('SELECT tasks.id, tasks.name FROM tasks INNER JOIN sessions ON sessions.user_id = tasks.user_id WHERE sessions.id = ?;');
                expect(tokenId).toBe(customToken);
                done();
            });
    });

    it('should create query with additional WHERE', (done) => {
        const customToken = 'token1234';
        const taskId = 15;
        dbUtil.queryRowsWithSession({
            tableName: 'tasks',
            fields: ['id', 'name'],
            tokenId: customToken,
            where: `tasks.id = ${taskId}`,
        })
            .then(({query}) => {
                expect(query.replace(/\s+/g, ' '))
                    .toBe(`SELECT tasks.id, tasks.name FROM tasks INNER JOIN sessions ON sessions.user_id = tasks.user_id WHERE sessions.id = ? AND (tasks.id = ${taskId});`);
                done();
            });
    });
});
