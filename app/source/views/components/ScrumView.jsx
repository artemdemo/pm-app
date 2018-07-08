import React from 'react';
import { Translate } from 'react-localize-redux';
import ElementsRow from '../../components/ElementsRow/ElementsRow';
import BoardsList from '../../containers/BoardsList/BoardsList';
import * as location from '../../services/location';

const ScrumView = (props) => {
    return (
        <React.Fragment>
            <ElementsRow className='form-group'>
                <button
                    className='btn btn-light'
                    onClick={() => location.push('/scrum/new')}
                >
                    <Translate id='new-board' />
                </button>
                <button
                    className='btn btn-light'
                    onClick={() => location.push('/scrum/plan')}
                >
                    <Translate id='plan-tasks' />
                </button>
            </ElementsRow>
            <BoardsList />
            {props.children}
        </React.Fragment>
    );
};

export default ScrumView
