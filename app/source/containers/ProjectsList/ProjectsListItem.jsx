import React from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import emoji from '../../utils/emoji/emoji';
import * as location from '../../services/location';

import './ProjectsListItem.less';

class ProjectsListItem extends React.PureComponent {
    filterTasks(filter) {
        const { tasks, project } = this.props;
        if (project.tasks.length === 0) {
            return [];
        }
        switch (filter) {
            case 'done':
                return tasks.data.filter((task) => {
                    return task.done === true && project.tasks.indexOf(task.id) !== -1;
                });
            case 'all':
            default:
                return tasks.data.filter((task) => {
                    return project.tasks.indexOf(task.id) !== -1;
                });
        }
    }

    renderTasks() {
        const { project } = this.props;
        if (project.tasks.length > 0) {
            return (
                <React.Fragment>
                    <div className='text-muted'>
                        Total: {this.filterTasks('all').length}
                    </div>
                    <div className='text-muted'>
                        Done: {this.filterTasks('done').length}
                    </div>
                </React.Fragment>
            );
        }
        return null;
    }

    render() {
        const { project } = this.props;
        return (
            <div
                className='projects-list-item'
                onClick={() => location.push(`projects/${project.id}`)}
            >
                <div className='projects-list-item__title'>
                    {emoji(project.name)}
                </div>
                {this.renderTasks()}
            </div>
        );
    }
}

ProjectsListItem.propTypes = {
    project: propTypes.shape({}),
};

ProjectsListItem.defaultProps = {
    project: {},
};


// ToDo: Why ProjectsListItem is connected??
export default connect(
    state => ({
        tasks: state.tasks,
    })
)(ProjectsListItem);
