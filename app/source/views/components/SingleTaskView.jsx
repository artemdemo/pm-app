import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import _isString from 'lodash/isString';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import OkCircle from '../../components/OkCircle/OkCircle';
import SelectList from '../../components/SelectList/SelectList';
import EntityModal from '../../components/EntityModal/EntityModal';
import {
    updateTask,
    loadSingleTask,
    deleteTask,
} from '../../model/tasks/tasksActions';
import Task from '../../model/tasks/Task';
import * as location from '../../services/location';

class SingleTaskView extends React.PureComponent {
    static getDerivedStateFromProps(props, state) {
        const { tasks } = props;
        if (tasks.singleData !== state.prevSingleData) {
            const task = tasks.singleData;
            return {
                name: task.name || '',
                description: task.description || '',
                done: task.done || false,
                selectedProjects: task.projects || [],
                prevSingleData: task,
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
            prevSingleData: null,
            selectedProjects: [],
        };
    }

    componentDidMount() {
        const { loadSingleTask, params } = this.props;
        loadSingleTask(params.taskId);
    }

    connectProject = (project) => {
        if (!this.state.selectedProjects.includes(project)) {
            this.setState({
                selectedProjects: [
                    ...this.state.selectedProjects,
                    project,
                ],
            });
        }
    };

    submitTask = () => {
        const { updateTask, tasks } = this.props;
        const task = new Task({
            ...tasks.singleData,
            name: this.state.name,
            description: this.state.description,
            done: this.state.done,
            projects: this.state.selectedProjects.map(item => item.id),
        });
        updateTask(task);
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
                    {this.state.selectedProjects.map((item, index) => (
                        <span key={`single-task-projects-item-${index}`}>{item.name}</span>
                    ))}
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
                                data-qa='task-save'
                            >
                                <span>Save</span>
                            </button>
                            <Link
                                className='btn btn-light'
                                to={location.wrapUrl('/tasks')}
                            >
                                Cancel
                            </Link>
                        </span>
                    </div>
                    <div className='col-4'>

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
        loadSingleTask,
        deleteTask,
    }
)(SingleTaskView);
