import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './OkCircle.less';

export class OkCircle extends Component {
    constructor(props) {
        super(props);

        this.state = {
            doneStatus: props.doneStatus,
        };
    }

    componentWillReceiveProps(nextProps) {
        const { doneStatus } = nextProps;
        this.setState({
            doneStatus,
        });
    }

    changeDoneStatus() {
        const { onChange } = this.props;
        const newDoneStatus = !this.state.doneStatus;
        if (onChange) {
            onChange(newDoneStatus);
        }
    }

    renderLoadingSpinner(loading) {
        if (loading) {
            return (
                <loading-spinner color='green' />
            );
        }
        return null;
    }

    renderOkCircle(loading) {
        const classOkCircle = classNames({
            'ok-circle': true,
            'ok-circle_with-text': !!this.props.children,
            'ok-circle_done': this.state.doneStatus,
        });
        if (!loading) {
            return (
                <span className={classOkCircle}>
                    <span
                        className='glyphicon glyphicon-ok-circle'
                        aria-hidden='true'
                    />
                </span>
            );
        }
        return null;
    }

    render() {
        const classOkCircleContent = classNames({
            'ok-circle-content': true,
            'ok-circle-content_done': this.state.doneStatus,
        });
        const { loading } = this.props;

        return (
            <span
                className='ok-circle-container'
                onClick={this.changeDoneStatus.bind(this)}
            >
                {this.renderOkCircle(loading)}
                {this.renderLoadingSpinner(loading)}
                <span className={classOkCircleContent}>
                    {this.props.children}
                </span>
            </span>
        );
    }
}

OkCircle.propTypes = {
    doneStatus: PropTypes.bool,
    loading: PropTypes.bool,
    onChange: PropTypes.func,
};

OkCircle.defaultProps = {
    doneStatus: false,
    loading: false,
};
