import React, { Component } from 'react';
import classNames from 'classnames';

import './OkCircle.less';

export class OkCircle extends Component {
    constructor(props) {
        super(props);

        this.renderOkCircle = (loading, doneStatus) => {
            const classOkCircle = classNames({
                'ok-circle': true,
                'ok-circle_done': doneStatus,
            });
            if (!loading) {
                return (
                    <span className={classOkCircle}>
                        <span className='glyphicon glyphicon-ok-circle'
                              aria-hidden='true'></span>
                    </span>
                );
            }
            return null;
        };

        this.renderLoadingSpinner = (loading, doneStatus) => {
            if (loading) {
                return (
                    <loading-spinner color='green' />
                );
            }
            return null;
        };
    }

    render() {
        const classOkCircleContent = classNames({
            'ok-circle-content': true,
            'ok-circle-content_done': doneStatus,
        });
        const { doneStatus, loading } = this.props;

        return (
            <span className='ok-circle-container'>
                {this.renderOkCircle(loading, doneStatus)}
                {this.renderLoadingSpinner(loading, doneStatus)}
                <span className={classOkCircleContent}>
                    {this.props.children}
                </span>
            </span>
        );
    }
}

OkCircle.propTypes = {
    doneStatus: React.PropTypes.bool,
    loading: React.PropTypes.bool,
}

OkCircle.defaultProps = {
    doneStatus: false,
    loading: false,
}
