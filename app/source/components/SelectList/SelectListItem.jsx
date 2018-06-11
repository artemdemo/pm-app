import React from 'react';
import PropTypes from 'prop-types';
import { SilectItemProp } from './SelectListProps';

class SelectListItem extends React.PureComponent {
    clickHandler = () => {
        const { onClick, item } = this.props;
        onClick && onClick(item);
    };

    render() {
        const { item } = this.props;
        return (
            <div
                className='list-group-item list-group-item-action'
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
