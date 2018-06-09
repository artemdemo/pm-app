import React from 'react';
import { connect } from 'react-redux';
import emoji from '../../utils/emoji/emoji';
import RadioMenu from '../../components/RadioMenu/RadioMenu';
import TasksList from '../../containers/TasksList/TasksList';

const taskStatuses = [
    { value: 'all', name: 'All' },
    { value: 'active', name: 'Active' },
    { value: 'completed', name: 'Completed' },
];

class TasksView extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            filteredByProjectId: 'all',
            status: taskStatuses[0],
        };
    }

    selectRadioItem = (item) => {
        this.setState({
            status: item,
        });
    };

    filterProjects(projectsList) {
        return projectsList.filter(project => project.tasks.length > 0);
    }

    render() {
        const { tasks, projects } = this.props;
        const projectsList = this.filterProjects(projects.data);
        return (
            <React.Fragment>
                <div className='form-group'>
                    <div className='row'>
                        <div className='col-md-auto'>
                            <RadioMenu
                                list={taskStatuses}
                                selectedItem={this.state.status}
                                onChange={this.selectRadioItem}
                            />
                        </div>
                        <div className='col-md-4'>
                            <select
                                className='form-control input-sm'
                                onChange={(e) => {
                                    const projectId = e.target.value;
                                    this.setState({
                                        filteredByProjectId: projectId,
                                    });
                                }}>
                                <option value='all'>All projects</option>
                                <option value='free'>Tasks without project</option>
                                <option disabled>—</option>
                                {projectsList.map(project => (
                                    <option
                                        value={project.id}
                                        key={`project-filter-${project.id}`}
                                    >
                                        {emoji(project.name)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <TasksList
                    tasks={tasks.data}
                    byProjectId={this.state.filteredByProjectId}
                    byStatus={this.state.status.value}
                />
                {this.props.children}
            </React.Fragment>
        );
    }
}

export default connect(
    state => ({
        tasks: state.tasks,
        projects: state.projects,
    })
)(TasksView);
