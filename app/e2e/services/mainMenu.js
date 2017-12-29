/* eslint-disable strict */

'use strict';

/**
 * Get path to main menu item
 * @param menuId {String} - `tasks`, `scrum`, `projects` - case insensitive
 */
const getMainMenuPath = (menuId) => {
    switch (menuId.toLowerCase()) {
        case 'tasks':
            return '.navbar .navbar-nav li:first-of-type a';
        case 'scrum':
            return '.navbar .navbar-nav li:nth-of-type(2) a';
        case 'projects':
            return '.navbar .navbar-nav li:nth-of-type(3) a';
    }

    return null;
};

module.exports = {
    getMainMenuPath,
};
