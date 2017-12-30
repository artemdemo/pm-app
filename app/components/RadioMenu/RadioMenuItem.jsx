import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './RadioMenuItem.less';

const RadioMenuItem = (props) => {
    const { item, selected, onClick } = props;
    const itemClass = classnames({
        'radio-menu-item': true,
        'radio-menu-item_selected': selected,
    });
    return (
        <div
            className={itemClass}
            onClick={onClick}>
            {item.name}
        </div>
    );
};

RadioMenuItem.propTypes = {
    item: PropTypes.shape({}),
    selected: PropTypes.bool,
    onClick: PropTypes.func,
};

export default RadioMenuItem;
