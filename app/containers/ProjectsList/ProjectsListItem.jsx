import React from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import emoji from '../../utils/emoji/emoji';
import { selectProject } from '../../model/selectedEntity/selectedEntityActions';

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
                <div>
                    <div className='text-muted'>
                        Total: {this.filterTasks('all').length}
                    </div>
                    <div className='text-muted'>
                        Done: {this.filterTasks('done').length}
                    </div>
                </div>
            );
        }
        return null;
    }

    render() {
        const { project, selectProject } = this.props;
        return (
            <div
                className='projects-list-item'
                onClick={() => selectProject(project)}
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
    }), {
        selectProject,
    }
)(ProjectsListItem);
