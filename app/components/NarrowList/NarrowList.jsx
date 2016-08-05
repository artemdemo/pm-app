import React, { Component } from 'react';
import { NarrowListItem } from './NarrowListItem';

import './NarrowList.less';

export class NarrowList extends Component {
    render() {
        const { list, deletable, onDelete, onClick } = this.props;
        return (
            <ul className='narrow-list'>
                {list.map((item) => (
                    <NarrowListItem item={item}
                                    deletable={deletable}
                                    onClick={onClick}
                                    onDelete={onDelete}
                                    key={`narrowlist-${item.id}`} />
                ))}
            </ul>
        );
    }
}

NarrowList.propTypes = {
    list: React.PropTypes.arrayOf(React.PropTypes.object),
    deletable: React.PropTypes.bool,
    onDelete: React.PropTypes.func,
    onClick: React.PropTypes.func,
};
