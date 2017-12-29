import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import emoji from '../../utils/emoji/emoji';

import './DropdownListItem.less';

export const DropdownListItem = (props) => {
    const { item, onClick } = props;
    const itemClass = classnames({
        'dropdown-list-item': true,
        'dropdown-list-item_done': item.done,
    });
    return (
        <div
            className={itemClass}
            onClick={(item) => {
                onClick(item);
            }}
        >
            {emoji(item.name)}
        </div>
    );
};

DropdownListItem.propTypes = {
    item: PropTypes.shape({}).isRequired,
    onClick: PropTypes.func.isRequired,
};
