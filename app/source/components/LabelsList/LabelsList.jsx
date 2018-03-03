import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import LabelsListItem from './LabelsListItem';

import './LabelsList.less';

class LabelsList extends React.PureComponent {
    constructor(props) {
        super(props);

        // ToDo: ReSelect
        this.filterList = (list, limit) => {
            if (!limit) {
                return list;
            }
            const newList = [];
            let limitCount = 0;
            for (let i = 0, len = list.length; i < len; i++) {
                if (limitCount < limit) {
                    newList.push(list[i]);
                }
                limitCount++;
            }
            return newList;
        };
    }

    onDelete(item) {
        const { onDelete } = this.props;
        onDelete && onDelete(item);
    }

    render() {
        const { list, limit, delitable } = this.props;
        const ellipsisClass = classnames({
            'labels-list-item': true,
            label: true,
            'label-primary': true,
            'labels-list-item_hide': !limit || list.length <= limit,
        });
        return (
            <ul className='labels-list'>
                {this.filterList(list, limit).map(label => (
                    <LabelsListItem
                        item={label}
                        delitable={delitable}
                        onDelete={this.onDelete.bind(this)}
                        key={`label-${label.id}`}
                    />
                ))}
                <li className={ellipsisClass}>
                    ...
                </li>
            </ul>
        );
    }
}

LabelsList.propTypes = {
    list: PropTypes.arrayOf(PropTypes.shape({})),
    limit: PropTypes.number,
    delitable: PropTypes.bool,
    onDelete: PropTypes.func,
};

LabelsList.defaultProps = {
    list: [],
    limit: null,
    delitable: false,
    onDelete: null,
};

export default LabelsList;
