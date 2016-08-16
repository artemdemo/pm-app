/* eslint-disable strict*/
'use strict';

const helper = require('./helper');

const getProjectName = (() => {
    const projects = {};
    return (projectId) => {
        if (!projects[projectId]) {
            projects[projectId] =
                `New Project - ${projectId} - ${helper.getRandomWord(4)} ${helper.getRandomWord(12)}`;
        }
        return projects[projectId];
    };
})();

const getProjectDescription = (() => {
    const projects = {};
    return (projectId) => {
        if (!projects[projectId]) {
            projects[projectId] =
                `Description - ${projectId} - ${helper.getRandomWord(8)} ${helper.getRandomWord(12)}`;
        }
        return projects[projectId];
    };
})();

const getProjectPath = (id, groupName = 'active') => {
    switch (true) {
        case id === 'first':
            return `.projects-list[data-qa=projects-list__${groupName}] .projects-list-item:first-of-type`;
        case id === 'last':
            return `.projects-list[data-qa=projects-list__${groupName}] .projects-list-item:last-of-type`;
    }
    return `.projects-list[data-qa=projects-list__${groupName}] .projects-list-item:nth-child(${id})`;
};

const getProjectNamePath = (id, groupName = 'active') => {
    return `${getProjectPath(id, groupName)} .projects-list-item__title`;
};

module.exports = {
    getProjectName,
    getProjectDescription,
    getProjectPath,
    getProjectNamePath,
};
