import React, { Component } from 'react';

import './OkCircle.less';

export class OkCircle extends Component {
    constructor(props) {
        super(props);

        this.renderOkCircle = (loading) => {
            const classOkCircle = 'ok-circle'; // ok-circle_done
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

        this.renderLoadingSpinner = (loading) => {
            if (loading) {
                return (
                    <loading-spinner color='green' />
                );
            }
            return null;
        };
    }

    render() {
        const classOkCircleContent = 'ok-circle-content'; // ok-circle-content_done
        const { status, loading } = this.props;

        return (
            <span className='ok-circle-container'>
                {this.renderOkCircle(loading)}
                {this.renderLoadingSpinner(loading)}
                <span className={classOkCircleContent}>
                    {this.props.children}
                </span>
            </span>
        );
    }
}
