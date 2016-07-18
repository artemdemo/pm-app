import React, { Component } from 'react';
import classnames from 'classnames';

import './LoadingSpinner.less';

// Colors: black white blue green red

export class LoadingSpinner extends Component {
    render() {
        let color = this.props.color || 'black';
        const spinnerClass = classnames({
            'loading-spinner': true,
            [`btn-${color}`]: true
        });
        return (
             <span className={spinnerClass}></span>
        );
    }
}

LoadingSpinner.propTypes = {
    color: React.PropTypes.string
}
