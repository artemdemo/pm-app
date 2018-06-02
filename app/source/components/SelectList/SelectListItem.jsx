import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { SilectItemProp } from './SelectListProps';

import './SelectListItem.less';

class SelectListItem extends React.PureComponent {
    clickHandler = () => {
        const { onClick, item } = this.props;
        onClick && onClick(item);
    };

    render() {
        const { item } = this.props;
        const itemClass = classnames({
            'select-list-item': true,
            'select-list-item_done': item.done,
        });
        return (
            <div
                className={itemClass}
                onClick={this.clickHandler}
            >
                {item.name}
            </div>
        );
    }
}

SelectListItem.propTypes = {
    item: SilectItemProp.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default SelectListItem;
