import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import Flatpickr from 'flatpickr';
import _isNumber from 'lodash/isNumber';
import { filterProjects } from '../../utils/tasks';
import emoji from '../../utils/emoji/emoji';
import { deleteTask, updateTask } from '../../model/actions/tasks';
import LabelsList from '../../components/LabelsList/LabelsList';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import OkCircle from '../../components/OkCircle/OkCircle';
import DropdownList from '../../components/DropdownList/DropdownList';
import DeleteButton from '../../components/DeleteButton/DeleteButton';
import InputMd from '../../components/InputMd/InputMd';
import TextareaMd from '../../components/TextareaMd/TextareaMd';
import { errorMessage } from '../../model/actions/notification';

import './SingleTask.less';

class SingleTask extends React.PureComponent {
    constructor(props) {
        super(props);

        // ToDo: This code is working here? Assigning state in constructor??
        const { task } = props;
        const { selectedProjects, availableProjects } = filterProjects(task, props.projects);
        this.state = {
            name: task.name || '',
            description: task.description || '',
            board_id: task.board_id > 0 ? task.board_id : 0,
            done: task.done || false,
            sp: task.sp || 0,
            priority: task.priority || 0,
            loadingData: false,
            selectedProjects,
            availableProjects,
        };

        this.dueDateRef = this;
    }

    componentDidMount() {
        this.dueInstance = new Flatpickr(this.dueDateRef);
    }

    componentWillReceiveProps(nextProps) {
        const { task } = nextProps;
        const { selectedProjects, availableProjects } = filterProjects(task, nextProps.projects);
        this.setState({
            name: task.name || '',
            description: task.description || '',
            board_id: task.board_id > 0 ? task.board_id : 0,
            done: task.done || false,
            sp: task.sp || 0,
            priority: task.priority || 0,
            loadingData: false,
            selectedProjects,
            availableProjects,
        });
        this.dueInstance.setDate(task.due);
    }

    connectProject(newProject) {
        this.setState({
            selectedProjects: this.state.selectedProjects.concat([newProject]),
            availableProjects: this.state.availableProjects.filter(project => project.id !== newProject.id),
        });
    }

    disconnectProject(newProject) {
        this.setState({
            selectedProjects: this.state.selectedProjects.filter(project => project.id !== newProject.id),
            availableProjects: this.state.availableProjects.concat([newProject]),
        });
    }

    deleteTask() {
        const { task, deleteTask, onDelete } = this.props;
        deleteTask(task.id);
        onDelete();
    }

    submitTask() {
        const { task, updateTask, errorMessage, onSave } = this.props;
        const boardId = this.state.board_id;
        const due = this.dueDateRef.value || null;

        if (this.state.name === '') {
            errorMessage('Name can\'t be empty');
            return;
        }

        const updatedTaskData = {
            id: task.id,
            name: this.state.name,
            description: this.state.description,
            done: this.state.done,
            sp: _isNumber(this.state.sp) ? Number(this.state.sp) : null,
            board_id: boardId > 0 ? Number(boardId) : null,
            projects: this.state.selectedProjects.map(project => project.id),
            priority: this.state.priority,
            due,
        };
        this.setState({
            loadingData: true,
        });
        updateTask(Object.assign(task, updatedTaskData));
        onSave();
    }

    toggleDone(newDoneStatus) {
        this.setState({
            done: newDoneStatus,
        });
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
        const { task, boards, settings, onCancel, className } = this.props;
        return (
            <div className={className}>
                <div className='form-group'>
                    <InputMd
                        type='text'
                        name='name'
                        value={this.state.name}
                        onChange={e => this.setState({
                            name: e.target.value,
                        })}
                        className='flat-input'
                        placeholder='Task name'
                        autoComplete='off'
                        key={`input-md-${task.id}`}
                        data-qa='task-name'
                    />
                </div>
                <div className='form-group'>
                    <TextareaMd
                        className='flat-input'
                        name='description'
                        rows='5'
                        value={this.state.description}
                        onChange={e => this.setState({
                            description: e.target.value,
                        })}
                        placeholder='No description'
                        key={`textarea-md-${task.id}`}
                        data-qa='task-description'
                    />
                </div>
                <div className='form-group'>
                    <OkCircle
                        doneStatus={this.state.done}
                        onChange={this.toggleDone.bind(this)}
                    >
                        Mark done
                    </OkCircle>
                </div>
                <div className='form-group'>
                    <LabelsList
                        list={this.state.selectedProjects}
                        onDelete={this.disconnectProject.bind(this)}
                        delitable
                    />
                </div>
                <div className='form-group'>
                    <DropdownList
                        list={this.state.availableProjects}
                        placeholder='Connect to project'
                        onSelect={this.connectProject.bind(this)}
                    />
                </div>
                <div className='form-group'>
                    <div className='row'>
                        <div className='col-xs-6'>
                            <select
                                className='form-control'
                                value={this.state.board_id}
                                onChange={e => this.setState({
                                    board_id: e.target.value,
                                })}
                                name='board'
                                disabled={this.state.done}
                                data-qa='select-board'
                            >
                                <option value='0'>No board selected</option>
                                {boards.map(board => (
                                    <option value={board.id} key={`board-${board.id}`}>
                                        {emoji(board.title)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='col-xs-6'>
                            <div className='input-group'>
                                <input
                                    type='number'
                                    name='sp'
                                    value={this.state.sp}
                                    onChange={e => this.setState({
                                        sp: e.target.value,
                                    })}
                                    className='form-control'
                                    placeholder='SP'
                                />
                                <div className='input-group-addon'>SP</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='form-group'>
                    <div className='row'>
                        <div className='col-xs-6'>
                            <div className='input-group'>
                                <div className='input-group-addon'>Due</div>
                                <input
                                    type='text'
                                    name='due'
                                    placeholder='Due date'
                                    ref={ref => this.dueDateRef = ref}
                                    className='form-control' />
                            </div>
                        </div>
                        <div className='col-xs-6'>
                            <select
                                className='form-control'
                                name='priority'
                                value={this.state.priority}
                                onChange={e => this.setState({
                                    priority: e.target.value,
                                })}
                                data-qa='select-priority'
                            >
                                <option>Select priority</option>
                                {settings.priority && settings.priority.map(item => (
                                    <option value={item.id} key={`priority-${item.id}`}>{item.value}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className='form-group text-muted'>
                    <p>Task Added: {task.added}</p>
                    <p>Last updated: {task.updated}</p>
                </div>
                <div className='clearfix'>
                    <div className='pull-left'>
                        <span className='buttons-group'>
                            <button
                                className='btn btn-primary'
                                onClick={this.submitTask.bind(this)}
                                data-qa='task-save'
                            >
                                <span>Save</span>
                            </button>
                            <span
                                className={cancelButtonClass}
                                onClick={() => onCancel()}
                                data-qa='task-cancel'
                            >
                                Cancel
                            </span>
                        </span>
                        {renderLoadingSpinner()}
                    </div>
                    <div className='pull-right'>
                        <DeleteButton onDelete={this.deleteTask.bind(this)} />
                    </div>
                </div>
            </div>
        );
    }
}

SingleTask.propTypes = {
    task: PropTypes.shape({}),
    className: PropTypes.string,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

SingleTask.defaultProps = {
    task: {},
    className: '',
};

export default connect(
    state => ({
        boards: state.boards,
        projects: state.projects,
        settings: state.settings,
    }),
    {
        deleteTask,
        updateTask,
        errorMessage,
    }
)(SingleTask);
