import React, { Component } from 'react';
import classnames from 'classnames';
import emoji from '../../utils/emoji/emoji';

import './NarrowListItem.less';

export class NarrowListItem extends Component {
    constructor(props) {
        super(props);

        this.itemClicked = (e) => {
            const { onClick, item } = this.props;

            if (onClick) {
                onClick(item, e);
            }
        };
    }

    render() {
        const { deletable, item, onDelete, onClick } = this.props;
        const classItem = classnames({
            'narrow-list-item': true,
            'narrow-list-item_delitable': deletable,
            'narrow-list-item_clickable': !!onClick,
            'narrow-list-item_done': item.done,
        });

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
            <li className={classItem}>
                <div className='narrow-list-item__cell
                                narrow-list-item__cell_name'
                     onClick={this.itemClicked}>
                    <span className='narrow-list-item__name'>
                        {emoji(item.name)}
                    </span>
                </div>
                <div className='narrow-list-item__cell
                                narrow-list-item__cell_close'>
                    {renderDeleteButton(item)}
                </div>
            </li>
        );
    }
}

NarrowListItem.propTypes = {
    deletable: React.PropTypes.bool,
    item: React.PropTypes.object,
    onDelete: React.PropTypes.func,
    onClick: React.PropTypes.func,
};
