import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { filterProjects } from '../../utils/tasks';
import emoji from '../../utils/emoji/emoji';
import { deleteTask, updateTask } from '../../actions/tasks';
import { LabelsList } from '../LabelsList/LabelsList';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import { OkCircle } from '../OkCircle/OkCircle';
import { DropdownList } from '../DropdownList/DropdownList';
import { DeleteButton } from '../DeleteButton/DeleteButton';
import { InputMd } from '../InputMd/InputMd';
import { TextareaMd } from '../TextareaMd/TextareaMd';
import { errorMessage } from '../../actions/notification';

import './SingleTask.less';

class SingleTask extends Component {
    constructor(props) {
        super(props);

        const task = this.getTask();
        const { selectedProjects, availableProjects } = filterProjects(task, props.projects);

        this.state = {
            name: task.name || '',
            description: task.description || '',
            board_id: task.board_id > 0 ? task.board_id : 0,
            done: task.done || false,
            loadingData: false,
            selectedProjects,
            availableProjects,
        };

        this.submitTask = (e) => {
            e.preventDefault();
            const { updateTask, errorMessage, onSave } = this.props;
            const task = this.getTask();
            const boardId = this.state.board_id;

            if (this.state.name === '') {
                errorMessage('Name can\'t be empty');
                return;
            }

            const updatedTaskData = {
                id: task.id,
                name: this.state.name,
                description: this.state.description,
                done: this.state.done,
                board_id: boardId > 0 ? Number(boardId) : null,
                projects: this.state.selectedProjects.map(project => project.id),
            };
            this.setState({
                loadingData: true,
            });
            updateTask(Object.assign(task, updatedTaskData));
            onSave();
        };

        this.deleteTask = () => {
            const task = this.getTask();
            const { deleteTask, onDelete } = this.props;
            deleteTask(task.id);
            onDelete();
        };

        this.toggleDone = (newDoneStatus) => {
            this.setState({
                done: newDoneStatus,
            });
        };

        this.connectProject = (newProject) => {
            this.setState({
                selectedProjects: this.state.selectedProjects.concat([newProject]),
                availableProjects: this.state.availableProjects.filter((project) => project.id !== newProject.id),
            });
        };

        this.disconnectProject = (newProject) => {
            this.setState({
                selectedProjects: this.state.selectedProjects.filter((project) => project.id !== newProject.id),
                availableProjects: this.state.availableProjects.concat([newProject]),
            });
        };
    }

    componentWillReceiveProps(nextProps) {
        const task = this.getTask(nextProps);
        const { selectedProjects, availableProjects } = filterProjects(task, nextProps.projects);
        this.setState({
            name: task.name || '',
            description: task.description || '',
            board_id: task.board_id > 0 ? task.board_id : 0,
            done: task.done || false,
            loadingData: false,
            selectedProjects,
            availableProjects,
        });
    }

    getTask(props = this.props) {
        return props.task || {};
    }

    render() {
        const cancelButtonClass = classnames({
            btn: true,
            'btn-default': true,
            btn_disabled: this.state.loadingData,
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
        };
        const { boards, onCancel, className } = this.props;
        const task = this.getTask();
        return (
            <form onSubmit={this.submitTask} className={className}>
                <div className='form-group'>
                    <InputMd type='text'
                             name='name'
                             value={this.state.name}
                             onChange={(e) => this.setState({
                                 name: e.target.value,
                             })}
                             className='flat-input'
                             placeholder='Task name'
                             autoComplete='off'
                             data-qa='task-name' />
                </div>
                <div className='form-group'>
                    <TextareaMd className='flat-input'
                                name='description'
                                rows='5'
                                value={this.state.description}
                                onChange={(e) => this.setState({
                                    description: e.target.value,
                                })}
                                placeholder='No description'
                                data-qa='task-description' />
                </div>
                <div className='form-group'>
                    <OkCircle doneStatus={this.state.done}
                              onChange={this.toggleDone}>
                              Mark done
                    </OkCircle>
                </div>
                <div className='form-group'>
                    <LabelsList list={this.state.selectedProjects}
                                delitable
                                onDelete={this.disconnectProject} />
                </div>
                <div className='form-group'>
                    <DropdownList list={this.state.availableProjects}
                                  placeholder='Connect to project'
                                  onSelect={this.connectProject} />
                </div>
                <div className='form-group'>
                    <select className='form-control'
                            value={this.state.board_id}
                            onChange={(e) => this.setState({
                                board_id: e.target.value,
                            })}
                            name='board'
                            disabled={this.state.done}
                            data-qa='select-board'>
                        <option value='0'>No board selected</option>
                        {boards.map((board) => (
                            <option value={board.id} key={`board-${board.id}`}>{emoji(board.title)}</option>
                        ))}
                    </select>
                </div>
                <div className='form-group text-muted'>
                    <p>Task Added: {task.added}</p>
                    <p>Last updated: {task.updated}</p>
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
                                  onClick={() => onCancel()}
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
    className: React.PropTypes.string,
    onSave: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func.isRequired,
    onDelete: React.PropTypes.func.isRequired,
};

export default connect(
    state => {
        return {
            boards: state.boards,
            projects: state.projects,
        };
    },
    {
        deleteTask,
        updateTask,
        errorMessage,
    }
)(SingleTask);
