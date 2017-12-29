import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { throttleLead } from './utils/throttle';
import { nerve } from './utils/nerve';
import { setLandingContainer, setNearItem, setPosition, getDraggedItemKey } from './services/dragService';

export class DragItemsContainer extends Component {
    constructor(props) {
        super(props);

        this.draggedItemCount = 0;
        this.singleItemKey = null;

        this.state = {
            renderPlaceholder: false,
        };

        this.dragOver = throttleLead(() => {
            if (
                this.draggedItemCount === 0 ||
                (this.draggedItemCount === 1 && this.singleItemKey === getDraggedItemKey())
            ) {
                this.setState({
                    renderPlaceholder: true,
                });
                clearTimeout(this.removePlaceholderTimeoutId);
                this.removePlaceholderTimeoutId = setTimeout(() => {
                    this.setState({
                        renderPlaceholder: false,
                    });
                }, 100);

                // If board has no items then `nearItem` should be set to `undefined`
                setNearItem();
                // as well as `position` case it's not relevant in this case
                setPosition();
            }
            const { container } = this.props;
            setLandingContainer(container);
        }, 50);
    }

    componentDidMount() {
        this.nerveId = nerve.on({
            route: 'item/drag-end',
            callback: () => {
                this.setState({
                    renderPlaceholder: false,
                });
                clearTimeout(this.removePlaceholderTimeoutId);
            },
        });
    }

    componentWillUnmount() {
        nerve.off({
            route: 'item/drag-end',
            id: this.nerveId,
        });
    }

    render() {
        const { className = '' } = this.props;
        this.draggedItemCount = this.props.children.length;

        const renderPlaceholder = () => {
            if (this.state.renderPlaceholder) {
                return (
                    <div className='drag-item__placeholder
                                    drag-item__placeholder_before' />
                );
            }
            return null;
        };

        const children = React.Children.map(
            this.props.children,
            (child) => {
                this.singleItemKey = this.draggedItemCount === 1 ? child.key : null;
                return React.cloneElement(child, {
                    $$key: child.key,
                });
            }
        );

        return (
            <div className={className}
                onDragOver={this.dragOver}>
                {renderPlaceholder()}
                {children}
            </div>
        );
    }
}

DragItemsContainer.PropTypes = {
    container: PropTypes.any,
};
