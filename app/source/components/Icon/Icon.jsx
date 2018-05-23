import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './Icon.less';

const iconTypes = {
    regular: 'regular',
    solid: 'solid',
};

/**
 *
 * @param props
 * @return {*}
 * @link https://fontawesome.com/get-started
 */
const Icon = (props) => {
    const { name, inText, className, type } = props;

    if (name === '' && !ENV.production) {
        throw new Error('Icon prop `name` couldn\'t be empty');
    }

    const iconClass = classnames(className, {
        far: type === iconTypes.regular,
        fas: type === iconTypes.solid,
        [`fa-${name}`]: true,
        'icon_in-text': inText,
    });
    return (
        <span className={iconClass} />
    );
};

Icon.propTypes = {
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
    inText: PropTypes.bool,
    type: PropTypes.oneOf(Object.keys(iconTypes)),
};

Icon.defaultProps = {
    className: '',
    inText: false,
    type: iconTypes.regular,
};

export default Icon;
