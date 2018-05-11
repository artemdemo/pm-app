const serializer = require('../utils/serializer');
const { queryRowsWithSession } = require('../utils/db');

const tableName = 'settings';

exports.getAll = async function(settingsData) {
    const rows = await queryRowsWithSession({
        tableName,
        fields: ['name', 'value'],
        tokenId: settingsData.tokenId,
    });
    return serializer.strArrToObj(rows);
};
