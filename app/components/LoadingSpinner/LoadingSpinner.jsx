import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './LoadingSpinner.less';

// Colors: black white blue green red

export const LoadingSpinner = (props) => {
    const { color } = props;
    const spinnerClass = classnames({
        'loading-spinner': true,
        [`btn-${color}`]: true,
    });
    return (
        <span className={spinnerClass} />
    );
};

LoadingSpinner.propTypes = {
    color: PropTypes.string,
};

LoadingSpinner.defaultProps = {
    color: 'black',
};
