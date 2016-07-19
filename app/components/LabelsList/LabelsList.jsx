import React, { Component } from 'react';
import { LabelsListItem } from './LabelsListItem';
import classnames from 'classnames';

import './LabelsList.less';

export class LabelsList extends Component {
    constructor(props) {
        super(props);

        this.filterList = (list, limit) => {
            if (!limit) {
                return list;
            } else {
                let newList = [];
                let limitCount = 0;
                for (let i = 0, len = list.length; i < len; i++) {
                    if (limitCount < limit) {
                        newList.push(list[i]);
                    }
                    limitCount++;
                }
                return newList;
            }
        }

        this.onDelete = (item) => {
            const { onDelete } = this.props;
            if (onDelete) {
                onDelete(item)
            }
        }
    }

    render() {
        const { list, limit, delitable } = this.props;
        const ellipsisClass = classnames({
            'labels-list-item': true,
            'label': true,
            'label-primary': true,
            'labels-list-item_hide': !limit || list.length <= limit
        });
        return (
            <ul className='labels-list'>
                {this.filterList(list, limit).map(label => (
                    <LabelsListItem item={label}
                                    delitable={delitable}
                                    onDelete={this.onDelete}
                                    key={`label-${label.id}`}/>
                ))}
                <li className={ellipsisClass}>
                    ...
                </li>
            </ul>
        );
    }
}

LabelsList.propTypes = {
    list: React.PropTypes.arrayOf(React.PropTypes.object),
    limit: React.PropTypes.number,
    delitable: React.PropTypes.bool,
    onDelete: React.PropTypes.func
}
