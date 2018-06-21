import React from 'react';
import PropTypes from 'prop-types';
import _isString from 'lodash/isString';

import './EntityModal.less';

class EntityModal extends React.PureComponent {
    renderTitle() {
        const { title } = this.props;
        if (_isString(title) && title.length > 0) {
            return (
                <div className='entity-modal-title border-bottom'>
                    {title}
                </div>
            );
        }
        return null;
    }

    render() {
        return (
            <div className='entity-modal rounded'>
                {this.renderTitle()}
                <div className='entity-modal-content'>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

EntityModal.propTypes = {
    title: PropTypes.string,
};

EntityModal.defaultProps = {
    title: null,
};

export default EntityModal;
