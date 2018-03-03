import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './DropdownListItem.less';

class DropdownListItem extends React.PureComponent {
    clickHandler() {
        const { onClick, item } = this.props;
        onClick && onClick(item);
    }

    render() {
        const { item } = this.props;
        const itemClass = classnames({
            'dropdown-list-item': true,
            'dropdown-list-item_done': item.done,
        });
        return (
            <div
                className={itemClass}
                onClick={this.clickHandler.bind(this)}
            >
                {item.name}
            </div>
        );
    }
}

DropdownListItem.propTypes = {
    item: PropTypes.shape({}).isRequired,
    onClick: PropTypes.func.isRequired,
};

export default DropdownListItem;
