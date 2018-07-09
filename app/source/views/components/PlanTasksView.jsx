import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Translate } from 'react-localize-redux';
import EntityModal from '../../components/EntityModal/EntityModal';
import PlanTasks from '../../containers/PlanTasksView/PlanTasks';
import EntityControllers from '../../components/EntityControllers/EntityControllers';
import * as location from '../../services/location';

const selectOnBoardTasks = createSelector(
    props => props.tasks.data,
    tasksList => tasksList.filter(task => task.board_id != null && task.board_id > -1)
);

const selectFreeTasks = createSelector(
    props => props.tasks.data,
    tasksList => tasksList.filter(task => task.board_id == null)
);

class PlanTasksView extends React.PureComponent {
    render() {
        return (
            <Translate>
                {({ translate }) => (
                    <React.Fragment>
                        <EntityModal title={translate('plan-tasks')}>
                            <strong>
                                {translate('selected-tasks')}
                            </strong>

                            <PlanTasks tasks={selectOnBoardTasks(this.props)} />

                            <hr />

                            <strong>
                                {translate('backlog-tasks')}
                            </strong>

                            <PlanTasks tasks={selectFreeTasks(this.props)} />

                            <hr />

                            <EntityControllers
                                onSave={this.submitBoard}
                                onClose={() => location.push('/scrum')}
                            />
                        </EntityModal>
                    </React.Fragment>
                )}
            </Translate>
        );
    }
}

export default connect(
    state => ({
        tasks: state.tasks,
    }),
)(PlanTasksView);
