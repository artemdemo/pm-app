import React from 'react';
import PropTypes from 'prop-types';
import NarrowListItem from './NarrowListItem';

import './NarrowList.less';

const NarrowList = (props) => {
    const { list, deletable, onDelete, onClick } = props;
    return (
        <ul className='narrow-list'>
            {list.map(item => (
                <NarrowListItem
                    item={item}
                    deletable={deletable}
                    onClick={onClick}
                    onDelete={onDelete}
                    key={`narrowlist-${item.id}`}
                />
            ))}
        </ul>
    );
};

NarrowList.propTypes = {
    list: PropTypes.arrayOf(PropTypes.shape({})),
    deletable: PropTypes.bool,
    onDelete: PropTypes.func,
    onClick: PropTypes.func,
};

export default NarrowList;
