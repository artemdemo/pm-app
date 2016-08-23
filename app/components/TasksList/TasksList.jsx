import React, { Component } from 'react';
import { connect } from 'react-redux';
import emoji from '../../utils/emoji/emoji';
import * as entityConst from '../../constants/selectedEntity';
import { RadioMenu } from '../RadioMenu/RadioMenu';
import TasksListItem from './TasksListItem';
import { clearEntity } from '../../actions/selectedEntity';

import './TasksList.less';

const tasksFilterService = (function() {
    const filterFunctions = {};
    const filterData = {};

    const addFilterData = (name, newFilterData = null) => {
        filterData[name] = newFilterData;
    };

    const addFilter = (name, filterFunc = null, newFilterData = null) => {
        filterFunctions[name] = filterFunc;
        addFilterData(name, newFilterData);
    };

    const runFilter = (name, tasks) => {
        if (filterFunctions[name]) {
            return filterFunctions[name](tasks, filterData[name]);
        }
        return tasks;
    };

    const runAllFilters = (startTasks) => {
        let tasks = startTasks;
        for (const filter in filterFunctions) {
            tasks = runFilter(filter, tasks);
        }
        return tasks;
    };

    return {
        addFilter,
        addFilterData,
        runAllFilters,
    };
})();

const FILTER_BY_DONE_STATUS = 'FILTER_BY_DONE_STATUS';
const FILTER_BY_PROJECTS = 'FILTER_BY_PROJECTS';

tasksFilterService.addFilter(FILTER_BY_DONE_STATUS, (tasks, data) => {
    return tasks.filter((task) => {
        switch (data) {
            case 'active':
                return task.done === false;
            case 'completed':
                return task.done === true;
            default:
                return true;
        }
    });
});

tasksFilterService.addFilter(FILTER_BY_PROJECTS, (tasks, data) => {
    switch (true) {
        case data === 'free':
            return tasks.filter(task => {
                return task.projects.length === 0;
            });
        case data && Number(data) === Number(data):
            return tasks.filter(task => {
                return task.projects.indexOf(Number(data)) > -1;
            });
        case data === 'all':
        default:
            return tasks;
    }
});

class TasksList extends Component {
    constructor(props) {
        super(props);

        this.allTasks = props.tasks || [];

        this.state = {
            tasks: tasksFilterService.runAllFilters(this.allTasks),
            projects: this.filterProjects(props.projects || []),
            filteredByProjectId: null,
        };

        this.listMenu = [
            { id: 'all', name: 'All' },
            { id: 'active', name: 'Active' },
            { id: 'completed', name: 'Completed' },
        ];

        this.sortingMenuItem = this.listMenu[0];

        this.selectRadioItem = (item) => {
            this.sortingMenuItem = item;
            tasksFilterService.addFilterData(FILTER_BY_DONE_STATUS, this.sortingMenuItem.id);
            this.setState({
                tasks: tasksFilterService.runAllFilters(this.allTasks),
            });
        };
    }

    componentWillReceiveProps(nextProps) {
        this.allTasks = nextProps.tasks;
        this.setState({
            tasks: tasksFilterService.runAllFilters(this.allTasks),
            projects: this.filterProjects(nextProps.projects),
        });
    }

    componentWillUnmount() {
        const { clearEntity } = this.props;
        clearEntity(entityConst.ENTITY_TASK);
    }

    filterProjects(projects) {
        return projects.filter(project => project.tasks.length > 0);
    }

    render() {
        const newTask = {
            name: '',
            description: '',
        };
        return (
            <div>
                <div className='fluid-oneline-grid'>
                    <div className='fluid-oneline-grid__cell'>
                        <RadioMenu list={this.listMenu} onSelect={this.selectRadioItem} />
                    </div>
                    <div className='fluid-oneline-grid__cell'>
                        <select className='form-control input-sm'
                                onChange={(e) => {
                                    const projectId = e.target.value;
                                    tasksFilterService.addFilterData(FILTER_BY_PROJECTS, projectId);
                                    this.setState({
                                        tasks: tasksFilterService.runAllFilters(this.allTasks),
                                        filteredByProjectId: projectId,
                                    });
                                }}>
                            <option value='all'>All projects</option>
                            <option value='free'>Tasks without project</option>
                            <option disabled>—</option>
                            {this.state.projects.map(project => (
                                <option value={project.id}
                                        key={`project-filter-${project.id}`}>
                                    {emoji(project.name)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className='tasks-list'>
                    <TasksListItem task={newTask}
                                   projectId={this.state.filteredByProjectId}
                                   key='task-0' />
                    {this.state.tasks.map(task => (
                        <TasksListItem task={task} key={`task-${task.id}`} />
                    ))}
                </div>
            </div>
        );
    }
}

export default connect(
    state => {
        return {
            tasks: state.tasks,
            projects: state.projects,
        };
    }, {
        clearEntity,
    }
)(TasksList);
