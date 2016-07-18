import React, { Component } from 'react';
import { RadioMenuItem } from './RadioMenuItem';

import './RadioMenu.less';

export class RadioMenu extends Component {
    render() {
        const { list } = this.props;
        return (
            <div className='radio-menu'>
                {list.map((item) => (
                    <RadioMenuItem item={item} key={`radio-menu-item-${item.id}`} />
                ))}
            </div>
        );
    }
}

RadioMenu.propTypes = {
    list: React.PropTypes.arrayOf(React.PropTypes.object)
}
