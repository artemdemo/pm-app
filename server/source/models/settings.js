const serializer = require('../utils/serializer');
const { queryRows } = require('../utils/db');

const tableName = 'settings';

exports.getAll = async function(settingsData) {
    const rows = await queryRows({
        tableName,
        fields: ['name', 'value'],
        userId: settingsData.userId,
    });
    return serializer.strArrToObj(rows);
};
