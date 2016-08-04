import React, { Component } from 'react';
import classNames from 'classnames';

import './NarrowList.less';

export class NarrowList extends Component {
    render() {
        const { list, deletable, onDelete } = this.props;
        const renderDeleteButton = (item) => {
            if (deletable) {
                return (
                    <span className='narrow-list-item__close'
                          onClick={() => onDelete(item)}>
                        <span className='glyphicon
                                         glyphicon-remove'></span>
                    </span>
                );
            }

            return null;
        };
        return (
            <ul className='narrow-list'>
                {list.map((item) => {
                    const classItem = classNames({
                        'narrow-list-item': true,
                        'narrow-list-item_delitable': deletable,
                        'narrow-list-item_done': item.done,
                    });
                    return (
                        <li className={classItem} key={`narrowlist-${item.id}`}>
                            <div className='narrow-list-item__cell
                                            narrow-list-item__cell_name'>
                                <span className='narrow-list-item__name'>
                                    {item.name}
                                </span>
                            </div>
                            <div className='narrow-list-item__cell
                                            narrow-list-item__cell_close'>
                                {renderDeleteButton(item)}
                            </div>
                        </li>
                    );
                })}
            </ul>
        );
    }
}

NarrowList.propTypes = {
    list: React.PropTypes.arrayOf(React.PropTypes.object),
    deletable: React.PropTypes.bool,
    onDelete: React.PropTypes.func,
};
