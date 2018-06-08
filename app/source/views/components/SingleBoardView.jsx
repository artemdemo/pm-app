import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { createSelector } from 'reselect';
import EntityModal from '../../components/EntityModal/EntityModal';

class SingleBoardView extends React.PureComponent {
    render() {
        return (
            <EntityModal>
                Single Scrum Board
            </EntityModal>
        );
    }
}

export default connect(
    state => ({
        boards: state.boards,
    }),
)(SingleBoardView);
