import React from 'react';
import propTypes from 'prop-types';
import Icon from '../Icon/Icon';

/**
 * Catch error
 * @link https://reactjs.org/blog/2017/07/26/error-handling-in-react-16.html
 */

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch() {
        // Display fallback UI
        this.setState({ hasError: true });
    }

    renderText() {
        const { componentName } = this.props;
        const generalText = 'component failed, try to reload page.';
        if (componentName) {
            return `[!] <${componentName} /> ${generalText}`;
        }
        return `[!] ${generalText}`;
    }

    render() {
        if (this.state.hasError) {
            return (
                <div>
                    <Icon name='warning-sign' inText />
                    {this.renderText()}
                </div>
            );
        }
        return this.props.children;
    }
}

ErrorBoundary.propTypes = {
    componentName: propTypes.string,
};

ErrorBoundary.defaultProps = {
    componentName: null,
};

export default ErrorBoundary;
