import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { createSelector } from "reselect";
import OkCircle from '../../components/OkCircle/OkCircle';
import SelectList from '../../components/SelectList/SelectList';
import EntityModal from '../../components/EntityModal/EntityModal';
import ProjectLabels from '../../components/SingleTask/ProjectLabels';
import {
    updateTask,
    deleteTask,
} from '../../model/tasks/tasksActions';
import Task from '../../model/tasks/Task';
import * as location from '../../services/location';

const getCurrentTask = createSelector(
    props => props.tasks.data,
    props => props.params.taskId,
    (projects, taskId) => {
        return projects.find(item => String(item.id) === taskId);
    },
);

class SingleTaskView extends React.PureComponent {
    static getDerivedStateFromProps(props, state) {
        const task = getCurrentTask(props);
        if (task && task !== state.prevTask) {
            return {
                name: task.name || '',
                description: task.description || '',
                done: task.done || false,
                selectedProjects: task.projects || [],
                prevTask: task,
            };
        }
        return null;
    }

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            description: '',
            done: false,
            prevTask: null,
            selectedProjects: [],
        };
    }

    connectProject = (project) => {
        const hasProject = this.state.selectedProjects.find(item => item.id === project.id);

        if (!hasProject) {
            this.setState({
                selectedProjects: [
                    ...this.state.selectedProjects,
                    project,
                ],
            });
        }
    };

    disconnectProject = (project) => {
        this.setState({
            selectedProjects: this.state.selectedProjects.filter(item => item !== project),
        });
    };

    submitTask = () => {
        const { updateTask, params } = this.props;
        const currentTask = getCurrentTask(this.props);
        if (params.taskId === 'new') {
            const task = new Task({
                name: this.state.name,
                description: this.state.description,
                done: this.state.done,
                projects: this.state.selectedProjects.map(item => item.id),
            });
            updateTask(task);
        } else if (currentTask) {
            const task = new Task({
                ...currentTask,
                name: this.state.name,
                description: this.state.description,
                done: this.state.done,
                projects: this.state.selectedProjects.map(item => item.id),
            });
            updateTask(task);
        }
        location.push('/tasks');
    };

    deleteTask = () => {
        const { deleteTask, params } = this.props;
        deleteTask(Number(params.taskId));
        location.push('/tasks');
    };

    render() {
        const { projects } = this.props;
        return (
            <EntityModal>
                <div className='form-group'>
                    <input
                        type='text'
                        className='form-control'
                        placeholder='Task name'
                        onChange={e => this.setState({name: e.target.value})}
                        value={this.state.name}
                    />
                </div>
                <div className='form-group'>
                    <textarea
                        className='form-control'
                        placeholder='Task description'
                        rows='3'
                        onChange={e => this.setState({description: e.target.value})}
                        value={this.state.description}
                    />
                </div>
                <div className='form-group'>
                    <OkCircle
                        doneStatus={this.state.done}
                        onChange={done => this.setState({ done })}
                    >
                        Mark done
                    </OkCircle>
                </div>
                <div className='form-group'>
                    <ProjectLabels
                        projects={this.state.selectedProjects}
                        onClick={this.disconnectProject}
                    />
                </div>
                <div className='form-group'>
                    <SelectList
                        list={projects.data}
                        placeholder='Connect to project'
                        onSelect={this.connectProject}
                    />
                </div>
                <div className='row justify-content-between'>
                    <div className='col-6'>
                        <span className='buttons-group'>
                            <button
                                className='btn btn-primary'
                                onClick={this.submitTask}
                            >
                                Save
                            </button>
                            <Link
                                className='btn btn-light'
                                to={location.wrapUrl('/tasks')}
                            >
                                Close
                            </Link>
                        </span>
                    </div>
                    <div className='col-4'>
                        <button
                            className='btn btn-danger'
                            onClick={this.deleteTask}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </EntityModal>
        );
    }
}

export default connect(
    state => ({
        tasks: state.tasks,
        projects: state.projects,
    }), {
        updateTask,
        deleteTask,
    }
)(SingleTaskView);
