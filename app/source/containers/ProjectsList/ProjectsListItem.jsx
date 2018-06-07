import React from 'react';
import propTypes from 'prop-types';
import pluralize from 'pluralize';
import _get from 'lodash/get';
import emoji from '../../utils/emoji/emoji';
import * as location from '../../services/location';

import './ProjectsListItem.less';

const ProjectsListItem = (props) => {
    const { project } = props;
    const tasksAmount = _get(project, 'tasks.length', 0);
    return (
        <div
            className='projects-list-item'
            onClick={() => location.push(`/projects/${project.id}`)}
        >
            <div className='projects-list-item__title'>
                {emoji(project.name)}
            </div>
            <div className='text-muted'>
                {pluralize('task', tasksAmount, true)}
            </div>
        </div>
    );
};

ProjectsListItem.propTypes = {
    project: propTypes.shape({}),
};

ProjectsListItem.defaultProps = {
    project: {},
};


// ToDo: Why ProjectsListItem is connected??
export default ProjectsListItem;
