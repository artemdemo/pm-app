/* eslint-disable strict*/
'use strict';

const helper = require('./services/helper');
const mainMenu = require('./services/mainMenu');
const auth = require('./suits/auth');

const getBoardName = (() => {
    const boards = {};
    return (boardId) => {
        if (!boards[boardId]) {
            boards[boardId] =
                `New Board - ${boardId} - ${helper.getRandomWord(7)}`;
        }
        return boards[boardId];
    };
})();

const getBoardPath = (id) => {
    switch (true) {
        case id === 'first':
            return '.boards-list .scrum-board:first-of-type';
        case id === 'last':
            return '.boards-list .scrum-board:last-of-type';
    }
    return `.boards-list .scrum-board:nth-child(${id})`;
};

const getBoardNamePath = (id) => {
    return `${getBoardPath(id)} .board__name`;
};

const getBoardEditPath = (id) => {
    return `${getBoardPath(id)} .board__edit-board`;
};

let boardIndex = 1;

module.exports = {
    'Add boards': (browser) => {
        auth.login(browser);

        browser.click(mainMenu.getMainMenuPath('scrum'));

        for (; boardIndex < 4; boardIndex++) {
            browser
                .click('button[data-qa=new-board]')
                .setValue('.single-board input[data-qa=board-name__input]', getBoardName(boardIndex))
                .click('.single-board button[data-qa=board-save]')
                .pause(200)
                .assert.containsText(getBoardNamePath('last'), getBoardName(boardIndex));
        }

        browser.assert.elementNotPresent('.single-board');
    },

    'Updated board': (browser) => {
        const boardName = 'Board name';
        const newBoardName = 'New Board name';

        browser
            .click('button[data-qa=new-board]')
            .setValue('.single-board input[data-qa=board-name__input]', boardName)
            .click('.single-board button[data-qa=board-save]')
            .pause(200)
            .assert.containsText(getBoardNamePath('last'), boardName)
            .click(getBoardEditPath('last'))
            .assert.value('.single-board input[data-qa=board-name]', boardName)
            .clearValue('.single-board input[data-qa=board-name]')
            .setValue('.single-board input[data-qa=board-name]', newBoardName)
            .click('.single-board select[data-qa=select-board] option[value="0"]')
            .click('.single-board button[data-qa=board-save]')
            .pause(200)
            .assert.containsText(getBoardNamePath('first'), newBoardName);
    },

    'Delete board': (browser) => {
        browser
            .click(getBoardEditPath('first'))
            .click('.single-board span[data-qa=delete-button]')
            .click('.single-board .delete-button .delete-button-buttons__ok')
            .pause(200)
            .assert.elementNotPresent('.pm-modal')
            .assert.containsText(getBoardNamePath('first'), getBoardName(1));

        auth.logout(browser);
    },
};
