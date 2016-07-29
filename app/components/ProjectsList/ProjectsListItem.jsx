import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectProject } from '../../actions/selectedEntity';

import './ProjectsListItem.less';

class ProjectsListItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tasks: props.tasks,
            project: props.project,
        }

        this.renderTasks = () => {
            if (this.state.project.tasks.length > 0) {
                return (
                    <div>
                        <div className='text-muted'>
                            Tasks: { this.filterTasks('all').length }
                        </div>
                        <div className='text-muted'>
                            Done: { this.filterTasks('done').length }
                        </div>
                    </div>
                );
            }
            return null;
        }
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

    render() {
        const { project, selectProject } = this.props;
        return (
            <div className='projects-list-item'
                 onClick={() => selectProject(project)}>
                <div className='projects-list-item__title'>
                    { project.name }
                </div>
                { this.renderTasks() }
            </div>
        );
    }
}

export default connect(
    state => {
        return {
            tasks: state.tasks
        }
    }, {
        selectProject,
    }
)(ProjectsListItem);
