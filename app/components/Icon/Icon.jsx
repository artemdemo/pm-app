import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const Icon = (props) => {
    const { name, className, onClick } = props;

    if (name === '' && !ENV.production) {
        console.warn('Icon prop `name` couldn\'t be empty');
    }

    const iconClass = classnames(`glyphicon glyphicon-${name}`, className);
    return (
        <span className={iconClass} onClick={onClick} />
    );
};

Icon.propTypes = {
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func,
};

Icon.defaultProps = {
    className: '',
    onClick: null,
};

export default Icon;
