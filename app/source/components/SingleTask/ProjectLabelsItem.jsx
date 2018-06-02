import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon/Icon';

import './ProjectLabelsItem.less';

const ProjectLabelsItem = (props) => {
    const { project, onClick } = props;
    return (
        <div
            className='project-labels-item bg-light'
            onClick={() => onClick(project)}
        >
            <Icon name='suitcase' type='solid' className='text-muted' inText />
            {project.name}
        </div>
    );
};

ProjectLabelsItem.propTypes = {
    project: PropTypes.shape({}),
    onClick: PropTypes.func.isRequired,
};

ProjectLabelsItem.defaultProps = {
    project: {},
};

export default ProjectLabelsItem;
