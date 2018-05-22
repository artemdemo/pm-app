import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './Icon.less';

const Icon = (props) => {
    const { name, inText, className, onClick } = props;

    if (name === '' && !ENV.production) {
        throw new Error('Icon prop `name` couldn\'t be empty');
    }

    const iconClass = classnames(className, {
        glyphicon: true,
        [`glyphicon-${name}`]: true,
        'icon_in-text': inText,
    });
    return (
        <span className={iconClass} onClick={onClick} />
    );
};

Icon.propTypes = {
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func,
    inText: PropTypes.bool,
};

Icon.defaultProps = {
    className: '',
    onClick: null,
    inText: false,
};

export default Icon;
