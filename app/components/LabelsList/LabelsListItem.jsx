import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import emoji from '../../utils/emoji/emoji';

import './LabelsListItem.less';

class LabelsListItem extends React.PureComponent {
    deleteItem() {
        const { item, onDelete } = this.props;
        onDelete && onDelete(item);
    }

    renderCloseButton(delitable) {
        if (delitable) {
            return (
                <span
                    className='labels-list-item__close'
                    onClick={this.deleteItem.bind(this)}
                >
                    <span className='glyphicon glyphicon-remove' />
                </span>
            );
        }
        return null;
    }

    render() {
        const { item, delitable } = this.props;
        const itemClass = classnames({
            label: true,
            'labels-list-item': true,
            'label-primary': true,
            'labels-list-item_delitable': delitable,
        });
        return (
            <li className={itemClass}>
                {emoji(item.name)}
                {this.renderCloseButton(delitable)}
            </li>
        );
    }
}

LabelsListItem.propTypes = {
    item: PropTypes.shape({}),
    delitable: PropTypes.bool,
    onDelete: PropTypes.func,
};

LabelsListItem.defaultProps = {
    item: {},
    delitable: false,
    onDelete: null,
};

export default LabelsListItem;
