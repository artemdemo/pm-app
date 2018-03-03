const db = require('../db');

describe('DB utils', () => {
    it('should throw error if fields are not array', () => {
        db.queryRowsWithSession('tableName')
            .catch((e) => {
                expect(e.message).toBe('`fields` should be array');
            });
    });
});
