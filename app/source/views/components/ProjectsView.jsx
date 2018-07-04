import React from 'react';
import { connect } from 'react-redux';
import { Translate } from 'react-localize-redux';
import ProjectsList from '../../containers/ProjectsList/ProjectsList';
import * as location from '../../services/location';

const ProjectsView = (props) => {
    const { projects } = props;
    return (
        <React.Fragment>
            <p>
                <button
                    className='btn btn-light'
                    onClick={() => location.push('/projects/new')}
                >
                    <Translate id='new-project' />
                </button>
            </p>
            <ProjectsList
                projects={projects.data}
            />
            {props.children}
        </React.Fragment>
    );
};

export default connect(
    state => ({
        selectedEntity: state.selectedEntity,
        projects: state.projects,
    })
)(ProjectsView);
