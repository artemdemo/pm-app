import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Translate } from 'react-localize-redux';
import EntityModal from '../../components/EntityModal/EntityModal';
import PlanTasks from '../../containers/PlanTasksView/PlanTasks';
import EntityControllers from '../../components/EntityControllers/EntityControllers';
import * as location from '../../services/location';

const selectOnBoardTasks = createSelector(
    state => state.tasks,
    tasksList => tasksList.filter(task => task.$selected)
);

const selectFreeTasks = createSelector(
    props => props.tasks,
    tasksList => tasksList.filter(task => !task.$selected)
);

class PlanTasksView extends React.PureComponent {
    static getDerivedStateFromProps(props) {
        return {
            tasks: props.tasks.data.map((task) => {
                const isSelected = task.board_id != null && task.board_id > -1;
                return {
                    ...task,
                    $selected: isSelected,
                };
            }),
        }
    }

    constructor(props) {
        super(props);

        this.state = {
            tasks: [],
        };
    }

    dragStopped = (itemData) => {
        this.setState({
            tasks: this.state.tasks.map((task) => {
                if (task.id === itemData.item) {
                    return {
                        ...task,
                        $selected: itemData.container === 'selected-tasks'
                    };
                }
                return task;
            }),
        })
    };

    render() {
        return (
            <Translate>
                {({ translate }) => (
                    <React.Fragment>
                        <EntityModal title={translate('plan-tasks')}>
                            <strong>
                                {translate('selected-tasks')}
                            </strong>

                            <PlanTasks
                                name='selected-tasks'
                                tasks={selectOnBoardTasks(this.state)}
                                dragStopped={this.dragStopped}
                            />

                            <hr />

                            <strong>
                                {translate('backlog-tasks')}
                            </strong>

                            <PlanTasks
                                name='backlog-tasks'
                                tasks={selectFreeTasks(this.state)}
                                dragStopped={this.dragStopped}
                            />

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
