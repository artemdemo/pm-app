import React, { Component } from 'react';
import classnames from 'classnames';

import './RadioMenuItem.less';

export class RadioMenuItem extends Component {
    select() {}

    render() {
        const { item } = this.props;
        const itemClass = classnames({
            'radio-menu-item': true,
            'radio-menu-item_selected': false
        });
        return (
            <div className={itemClass}
                 onClick={this.select(item)}>
                {item.name}
            </div>
        );
    }
}

RadioMenuItem.propTypes = {
    item: React.PropTypes.object
}
