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

        const task = this.getTask();
        const { selectedProjects, availableProjects } = filterProjects(task, props.projects);

        this.state = {
            name: '',
            description: '',
            board_id: task.board_id > 0 ? task.board_id : 0,
            done: task.done,
            loadingData: false,
            selectedProjects,
            availableProjects,
        };

        this.submitTask = (e) => {
            e.preventDefault();
            const { updateTask } = this.props;
            const task = this.getTask();
            const board_id = this.state.board_id;
            const updatedTaskData = {
                id: task.id,
                name: this.state.name,
                description: this.state.description,
                done: this.state.done,
                board_id: board_id > 0 ? board_id : null,
                projects: this.state.selectedProjects.map(project => project.id),
            }
            this.setState({
                loadingData: true,
            });
            updateTask(Object.assign(task, updatedTaskData));
        }

        this.deleteTask = () => {
            const task = this.getTask();
            const { deleteTask, clearEntity } = this.props;
            deleteTask(task.id);
        }

        this.toggleDone = (newDoneStatus) => {
            this.setState({
                done: newDoneStatus,
            })
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
            board_id: task.board_id > 0 ? task.board_id : 0,
            loadingData: false,
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
        const { clearEntity, projects, boards, selectedEntity } = this.props;
        const task = this.getTask();
        return (
            <form onSubmit={this.submitTask} className='single-panel'>
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
                                   description: e.target.value
                              })}
                              rows='3'
                              data-qa='task-description'></textarea>
                </div>
                <div className='form-group'>
                    <OkCircle doneStatus={task.done}
                              onChange={this.toggleDone}>
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
                            value={this.state.board_id}
                            onChange={(e) => this.setState({
                                board_id: e.target.value
                            })}
                            name='board'>
                        <option value="0">No board selected</option>
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
                        <span className='buttons-group'>
                            <button type='submit'
                                className='btn btn-primary'
                                data-qa='task-save'>
                                <span>Save</span>
                            </button>
                            <span className={cancelButtonClass}
                                  onClick={() => clearEntity(entityConst.ENTITY_TASK)}
                                  data-qa='task-cancel'>Cancel</span>
                        </span>
                        {renderLoadingSpinner()}
                    </div>
                    <div className='pull-right'>
                        <DeleteButton onDelete={this.deleteTask} />
                    </div>
                </div>
            </form>
        );
    }
}

SingleTask.propTypes = {
    task: React.PropTypes.object,
    boards: React.PropTypes.arrayOf(React.PropTypes.object),
    projects: React.PropTypes.arrayOf(React.PropTypes.object),
    selectedEntity: React.PropTypes.object,
}

export default connect(
    state => {
        return {
            boards: state.boards,
            projects: state.projects,
            selectedEntity: state.selectedEntity,
        }
    },
    {
        clearEntity,
        deleteTask,
        updateTask,
    }
)(SingleTask);
