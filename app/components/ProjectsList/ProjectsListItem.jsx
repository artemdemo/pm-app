import React from 'react';
import { connect } from 'react-redux';
import emoji from '../../utils/emoji/emoji';
import { selectProject } from '../../model/actions/selectedEntity';

import './ProjectsListItem.less';

class ProjectsListItem extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            tasks: props.tasks,
            project: props.project,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            tasks: nextProps.tasks,
            project: nextProps.project,
        });
    }

    filterTasks(filter) {
        if (this.state.project.tasks.length === 0) {
            return [];
        }
        switch (filter) {
            case 'done':
                return this.state.tasks.filter((task) => {
                    return task.done === true && this.state.project.tasks.indexOf(task.id) !== -1;
                });
            case 'all':
            default:
                return this.state.tasks.filter((task) => {
                    return this.state.project.tasks.indexOf(task.id) !== -1;
                });
        }
    }

    renderTasks() {
        if (this.state.project.tasks.length > 0) {
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


// ToDo: Why ProjectsListItem is connected??
export default connect(
    state => ({
        tasks: state.tasks,
    }), {
        selectProject,
    }
)(ProjectsListItem);
