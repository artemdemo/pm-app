import React from 'react';
import PropTypes from 'prop-types';
import ProjectLabelsItem from './ProjectLabelsItem';

import './ProjectLabels.less';

class ProjectLabels extends React.PureComponent {
    handleClick = (project) => {
        const { onClick } = this.props;
        onClick && onClick(project);
    };

    render() {
        const { projects } = this.props;
        return (
            <div className='project-labels'>
                {projects.map(item => (
                    <ProjectLabelsItem
                        project={item}
                        onClick={this.handleClick}
                        key={`project-labels-item-${item.id}`}
                    />
                ))}
            </div>
        );
    }
}

ProjectLabels.propTypes = {
    projects: PropTypes.arrayOf(PropTypes.shape({})),
    onClick: PropTypes.func,
};

ProjectLabels.defaultProps = {
    projects: [],
    onClick: null,
};

export default ProjectLabels;
