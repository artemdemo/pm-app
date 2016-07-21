import React, { Component } from 'react';
import classnames from 'classnames';

import './RadioMenuItem.less';

export class RadioMenuItem extends Component {
    render() {
        const { item, selected, onClick } = this.props;
        const itemClass = classnames({
            'radio-menu-item': true,
            'radio-menu-item_selected': selected
        });
        return (
            <div className={itemClass}
                 onClick={onClick}>
                {item.name}
            </div>
        );
    }
}

RadioMenuItem.propTypes = {
    item: React.PropTypes.object,
    selected: React.PropTypes.bool,
    onClick: React.PropTypes.func,
}
