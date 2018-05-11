import React from 'react';
import { connect } from 'react-redux';
import _isNumber from 'lodash/isNumber';
import _isNaN from 'lodash/isNaN';
import emoji from '../../utils/emoji/emoji';
import * as entityConst from '../../model/selectedEntity/selectedEntityConst';
import RadioMenu from '../../components/RadioMenu/RadioMenu';
import TasksListItem from './TasksListItem';
import { clearEntity } from '../../model/selectedEntity/selectedEntityActions';

import './TasksList.less';

class TasksList extends React.PureComponent {
    constructor(props) {
        super(props);

        this.statusMenu = [
            { id: 'all', name: 'All' },
            { id: 'active', name: 'Active' },
            { id: 'completed', name: 'Completed' },
        ];

        this.state = {
            filteredByProjectId: 'all',
            filteredByStatusId: this.statusMenu[0].id,
        };
    }

    componentWillUnmount() {
        const { clearEntity } = this.props;
        clearEntity(entityConst.ENTITY_TASK);
    }

    selectRadioItem(item) {
        this.setState({
            filteredByStatusId: item.id,
        });
    }

    filterProjects(projectsList) {
        return projectsList.filter(project => project.tasks.length > 0);
    }

    filterTasks(tasksList) {
        const filteredByStatus = tasksList
            .filter((task) => {
                switch (this.state.filteredByStatusId) {
                    case 'active':
                        return task.done === false;
                    case 'completed':
                        return task.done === true;
                    default:
                        return true;
                }
            });
        const resultList = (() => {
            const projectId = (() => {
                const projectIdNumber = parseInt(this.state.filteredByProjectId, 10);
                if (_isNaN(projectIdNumber)) {
                    return this.state.filteredByProjectId;
                }
                return projectIdNumber;
            })();
            switch (true) {
                case projectId === 'free':
                    return filteredByStatus.filter((task) => {
                        return task.projects.length === 0;
                    });
                case _isNumber(projectId):
                    return filteredByStatus.filter((task) => {
                        return task.projects.indexOf(projectId) > -1;
                    });
                case projectId === 'all':
                default:
                    return filteredByStatus;
            }
        })();
        return resultList;
    }

    render() {
        const { tasks, projects } = this.props;
        const tasksList = this.filterTasks(tasks.data);
        const projectsList = this.filterProjects(projects.data);
        const newTask = {
            name: '',
            description: '',
        };
        return (
            <div>
                <div className='fluid-oneline-grid'>
                    <div className='fluid-oneline-grid__cell'>
                        <RadioMenu
                            list={this.statusMenu}
                            onSelect={this.selectRadioItem.bind(this)}
                        />
                    </div>
                    <div className='fluid-oneline-grid__cell'>
                        <select
                            className='form-control input-sm'
                            onChange={(e) => {
                                const projectId = e.target.value;
                                this.setState({
                                    filteredByProjectId: projectId,
                                });
                            }}>
                            <option value='all'>All projects</option>
                            <option value='free'>Tasks without project</option>
                            <option disabled>—</option>
                            {projectsList.map(project => (
                                <option
                                    value={project.id}
                                    key={`project-filter-${project.id}`}
                                >
                                    {emoji(project.name)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className='tasks-list'>
                    <TasksListItem
                        task={newTask}
                        projectId={this.state.filteredByProjectId}
                        key='task-0'
                    />
                    {tasksList.map(task => (
                        <TasksListItem
                            task={task}
                            key={`task-${task.id}`}
                        />
                    ))}
                </div>
            </div>
        );
    }
}

export default connect(
    state => ({
        tasks: state.tasks,
        projects: state.projects,
    }), {
        clearEntity,
    }
)(TasksList);
