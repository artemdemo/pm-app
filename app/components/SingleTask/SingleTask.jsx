import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { filterProjects } from '../../utils/tasks';
import { deleteTask, updateTask } from '../../actions/tasks';
import { LabelsList } from '../LabelsList/LabelsList';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import { OkCircle } from '../OkCircle/OkCircle';
import { DropdownList } from '../DropdownList/DropdownList';
import { DeleteButton } from '../DeleteButton/DeleteButton';
import { clearEntity } from '../../actions/selectedEntity';
import * as entityConst from '../../constants/selectedEntity';

class SingleTask extends Component {
    constructor(props) {
        super(props);

        const { selectedProjects, availableProjects } = filterProjects(this.getTask(), props.projects);

        this.state = {
            name: '',
            description: '',
            board: 0,
            loadingData: false,
            selectedProjects,
            availableProjects,
        };

        this.submitTask = (e) => {
            const { updateTask } = this.props;
            const task = this.getTask();
            const board = this.state.board;
            e.preventDefault();
            const updatedTaskData = {
                id: task.id,
                name: this.state.name,
                description: this.state.description,
                board: board > 0 ? board : null,
                projects: this.state.selectedProjects.map(project => project.id),
            }
            updateTask(Object.assign(task, updatedTaskData));
        }

        this.deleteTask = () => {
            const task = this.getTask();
            const { deleteTask, clearEntity } = this.props;
            deleteTask(task.id);
        }

        this.toggleDone = () => {
            console.log('toggle done');
        }

        this.connectProject = (newProject) => {
            this.setState({
                selectedProjects: this.state.selectedProjects.concat([newProject]),
                availableProjects: this.state.availableProjects.filter((project) => project.id !== newProject.id),
            })
        }

        this.disconnectProject = (newProject) => {
            this.setState({
                selectedProjects: this.state.selectedProjects.filter((project) => project.id !== newProject.id),
                availableProjects: this.state.availableProjects.concat([newProject]),
            })
        }
    }

    getTask(props = this.props) {
        return props.task || {}
    }

    componentWillReceiveProps(nextProps) {
        const task = this.getTask(nextProps);
        const { selectedProjects, availableProjects } = filterProjects(task, nextProps.projects);
        this.setState({
            name: task.name || '',
            description: task.description || '',
            selectedProjects,
            availableProjects,
        });
    }

    render() {
        const cancelButtonClass = classnames({
            'btn': true,
            'btn-default': true,
            'btn_disabled': this.state.loadingData
        });
        const renderLoadingSpinner = () => {
            if (this.state.loadingData) {
                return (
                    <span className='btn btn-link'>
                        <LoadingSpinner />
                    </span>
                );
            }
            return null;
        }
        const { clearEntity, projects, boards } = this.props;
        const task = this.getTask();
        return (
            <div className='single-panel'>
                <form onSubmit={this.submitTask}>
                    <div className='form-group'>
                        <input type='text'
                               name='name'
                               value={this.state.name}
                               onChange={(e) => this.setState({
                                    name: e.target.value
                               })}
                               className='flat-input'
                               placeholder='Task name'
                               data-qa='task-name' />
                    </div>
                    <div className='form-group'>
                        <textarea className='flat-input'
                                  name='description'
                                  value={this.state.description}
                                  onChange={(e) => this.setState({
                                       name: e.target.value
                                  })}
                                  rows='3'
                                  data-qa='task-description'></textarea>
                    </div>
                    <div className='form-group'>
                        <OkCircle doneStatue={task.done}
                                  onClick={this.toggleDone}>
                                  Mark done
                        </OkCircle>
                    </div>
                    <div className='form-group'>
                        <LabelsList list={this.state.selectedProjects}
                                    delitable={true}
                                    onDelete={this.disconnectProject} />
                    </div>
                    <div className='form-group'>
                        <DropdownList list={this.state.availableProjects}
                                      placeholder="Connect to project"
                                      onSelect={this.connectProject} />
                    </div>
                    <div className='form-group'>
                        <select className='form-control'
                                value={this.state.board}
                                onChange={(e) => this.setState({
                                    board: e.target.value
                                })}
                                name='board'>
                            <option value="0">Select board</option>
                            {boards.map((board) => (
                                <option value={board.id} key={`board-${board.id}`}>{board.title}</option>
                            ))}
                        </select>
                    </div>
                    <div className='form-group text-muted'>
                        <p>Task Added: { task.added }</p>
                        <p>Last updated: { task.updated }</p>
                    </div>
                    <div className='clearfix'>
                        <div className='pull-left'>
                            <button type='submit'
                                    className='btn btn-primary'
                                    data-qa='task-save'>
                                <span>Save</span>
                            </button>
                            <span className={cancelButtonClass}
                                  onClick={() => clearEntity(entityConst.ENTITY_TASK)}
                                  data-qa='task-cancel'>Cancel</span>
                            {renderLoadingSpinner()}
                        </div>
                        <div className='pull-right'>
                            <DeleteButton onDelete={this.deleteTask} />
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

SingleTask.propTypes = {
    task: React.PropTypes.object,
    boards: React.PropTypes.arrayOf(React.PropTypes.object),
    projects: React.PropTypes.arrayOf(React.PropTypes.object),
}

export default connect(
    state => {
        return {
            boards: state.boards,
            projects: state.projects,
        }
    },
    {
        clearEntity,
        deleteTask,
        updateTask,
    }
)(SingleTask);
