import React, { Component } from 'react';
import { connect } from 'react-redux';
import { filterProjects } from '../../utils/tasks';
import { LabelsList } from '../LabelsList/LabelsList';

import './BoardTask.less';

class BoardTask extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { task, projects } = this.props;
        const { selectedProjects } = filterProjects(task, projects);
        const taskHTML = (
            <div className='board-task'>
                <div className='board-task__menu-icon'>
                    <span className='glyphicon glyphicon-option-vertical'
                          aria-hidden='true'></span>
                </div>
                {task.name}
                <div className='board-task__labels-list'>
                    <LabelsList list={selectedProjects}
                                delitable={false} />
                </div>
            </div>
        );
        return taskHTML;
    }
}

BoardTask.proptypes = {
    task: React.PropTypes.object,
};

export default connect(
    state => {
        return {
            projects: state.projects,
        };
    }
)(BoardTask);
