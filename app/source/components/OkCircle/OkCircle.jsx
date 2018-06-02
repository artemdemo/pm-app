import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../../components/Icon/Icon';

import './OkCircle.less';

class OkCircle extends React.PureComponent {
    changeDoneStatus = () => {
        const { doneStatus, onChange } = this.props;
        onChange && onChange(!doneStatus);
    };

    render() {
        const { doneStatus } = this.props;
        const classOkCircleContent = classNames({
            'ok-circle-content': true,
            'ok-circle-content_done': doneStatus,
        });
        const classOkCircle = classNames({
            'ok-circle': true,
            'ok-circle_with-text': !!this.props.children,
            'ok-circle_done': doneStatus,
        });

        return (
            <span
                className='ok-circle-container'
                onClick={this.changeDoneStatus}
            >
                <span className={classOkCircle}>
                    <Icon name='check-circle' />
                </span>
                <span className={classOkCircleContent}>
                    {this.props.children}
                </span>
            </span>
        );
    }
}

OkCircle.propTypes = {
    doneStatus: PropTypes.bool,
    onChange: PropTypes.func,
};

OkCircle.defaultProps = {
    doneStatus: false,
    onChange: null,
};

export default OkCircle;
