/* eslint-disable no-console, strict*/
'use strict';

/**
 * Convert array of strings to json object
 *
 * @param dataArr {Array}
 * @return {Object}
 */
const strArrToObj = (dataArr) => {
    const result = {};
    dataArr.forEach(item => {
        const nameRegexp = /([^\[\]{}]+)(?:(\[[\d]*])|({\}))?/g;
        const nameParts = [];
        let match = nameRegexp.exec(item.name);

        while (match !== null) {
            const part = {
                name: match[1],
                grouping: match[2] || match[3],
            };
            if (match.index === nameRegexp.lastIndex) {
                nameRegexp.lastIndex++;
            }
            nameParts.push(part);
            match = nameRegexp.exec(item.name);
        }

        const getGroupingObj = (grouping) => grouping === '{}' ? {} : [];

        if (nameParts.length > 0) {
            let prevPart = null;
            let propLink = result;

            for (let i = 0, len = nameParts.length; i < len; i++) {
                const currentPart = nameParts[i];

                if (!prevPart || prevPart.grouping === '{}') {
                    if (currentPart.grouping) {
                        if (!propLink[currentPart.name]) {
                            propLink[currentPart.name] = getGroupingObj(currentPart.grouping);
                        }
                    } else {
                        propLink[currentPart.name] = item.value;
                    }
                    propLink = propLink[currentPart.name];
                    if (i + 1 === len && Array.isArray(propLink)) {
                        propLink.push(item.value);
                    }
                } else if (prevPart.grouping !== '{}') {
                    const indexRegexp = /\d+/;
                    const indexMatch = indexRegexp.exec(prevPart.grouping);

                    if (indexMatch) {
                        const index = Number(indexMatch[0]);
                        if (!propLink[index]) {
                            propLink[index] = {};
                        }
                        if (currentPart.grouping) {
                            propLink[index][currentPart.name] = getGroupingObj(currentPart.grouping);
                            propLink = propLink[index][currentPart.name];
                        } else {
                            propLink[index][currentPart.name] = item.value;
                        }
                    }
                } else {
                    propLink = item.value;
                }

                prevPart = currentPart;
            }
        }
    });

    return result;
};


/**
 * Convert object to array of strings
 *
 * @param dataObj {Object}
 * @return {Array}
 */
const objToStrArr = (dataObj) => {
    const result = [];
    const walker = (obj, prefix = '') => {
        for (const prop in obj) {
            let path = prefix;
            const propValue = obj[prop];

            if (Array.isArray(obj)) {
                path += `[${prop}]`;
            } else {
                if (path[path.length - 1] === ']') {
                    path += `${prop}`;
                } else if (path === '') {
                    path += prop;
                } else {
                    path += `{}${prop}`;
                }
            }

            if (typeof propValue === 'object') {
                walker(propValue, path);
            } else {
                result.push({
                    name: path,
                    value: propValue,
                });
            }
        }
        return result;
    };

    return walker(dataObj);
};

module.exports = {
    strArrToObj,
    objToStrArr,
};
