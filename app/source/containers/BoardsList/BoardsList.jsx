import React from 'react';
import { connect } from 'react-redux';
import ScrumBoard from './ScrumBoard';

import './BoardsList.less';

const BoardsList = (props) => {
    const { boards } = props;
    return (
        <div className='boards-list'>
            {boards.data.map((board, index) => {
                return (
                    <ScrumBoard
                        board={board}
                        utmostLeft={index === 0}
                        utmostRight={index === boards.data.length - 1}
                        key={`board-${board.id}`}
                    />
                );
            })}
        </div>
    );
};

export default connect(
    state => ({
        boards: state.boards,
    })
)(BoardsList);
