import React from 'react';
import { Translate } from 'react-localize-redux';
import BoardsList from '../../containers/BoardsList/BoardsList';
import * as location from '../../services/location';

const ScrumView = (props) => {
    return (
        <React.Fragment>
            <p>
                <button
                    className='btn btn-light'
                    onClick={() => location.push('/scrum/new')}
                >
                    <Translate id='new-board' />
                </button>
            </p>
            <BoardsList />
            {props.children}
        </React.Fragment>
    );
};

export default ScrumView
