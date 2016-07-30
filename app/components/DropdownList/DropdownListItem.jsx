import React, { Component } from 'react';
import classnames from 'classnames';

import './DropdownListItem.less';

export class DropdownListItem extends Component {
    render() {
        const { item, onClick } = this.props;
        const itemClass = classnames({
            'dropdown-list-item': true,
            'dropdown-list-item_done': item.done,
        });
        return (
            <div className={itemClass}
                 onClick={(item) => {
                     onClick(item);
                 }}>
                {item.name}
            </div>
        );
    }
}

DropdownListItem.propTypes = {
    item: React.PropTypes.object.isRequired,
    onClick: React.PropTypes.func.isRequired,
};
