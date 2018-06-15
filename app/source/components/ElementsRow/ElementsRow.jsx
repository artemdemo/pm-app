import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './ElementsRow.less';

/**
 * <ElementsRow /> is used to add margin between elements
 */
const ElementsRow = (props) => {
    let children;
    const childAmount = React.Children.count(props.children);
    if (childAmount > 1) {
        children = React.Children.map(
            props.children,
            (child, index) => {
                if (child) {
                    const newProps = {
                        className: classnames(child.props.className, {
                            'elements-row-item': true,
                            'elements-row-item_last': index === childAmount - 1,
                        }),
                    };
                    return React.cloneElement(child, newProps);
                }
                return null;
            }
        );
    } else {
        // eslint-disable-next-line prefer-destructuring
        children = props.children;
    }
    const { inline, nowrap, className } = props;
    const wrapClass = classnames(className, {
        'elements-row': true,
        'elements-row_inline': inline,
        'elements-row_nowrap': nowrap,
    });
    return (
        <div className={wrapClass}>
            {children}
        </div>
    );
};

ElementsRow.propTypes = {
    inline: PropTypes.bool,
    nowrap: PropTypes.bool,
    className: PropTypes.string,
};

ElementsRow.defaultProps = {
    inline: false,
    nowrap: false,
    className: '',
};

export default ElementsRow;
