import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import * as entityConst from '../constants/selectedEntity';
import MainMenu from '../components/MainMenu/MainMenu';
import BoardsList from '../components/BoardsList/BoardsList';
import SingleTask from '../components/SingleTask/SingleTask';

class ScrumView extends Component {
    render() {
        const { selectedEntity } = this.props;
        const selectedTask = !!selectedEntity && selectedEntity.type === entityConst.ENTITY_TASK ?
                             selectedEntity.entity :
                             null;
        const classView = classnames({
            'list-container': true,
            'list-container_open-right-panel': !!selectedTask,
        });
        return (
            <div>
                <MainMenu />

                <div className={classView}>
                    <div className='list-container__list'>
                        <BoardsList />
                    </div>
                    <div className='list-container__panel'>
                        <SingleTask task={selectedTask} />
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    state => {
        return {
            selectedEntity: state.selectedEntity,
        };
    }
)(ScrumView);
