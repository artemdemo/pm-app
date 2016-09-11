import React, { Component } from 'react';
import classnames from 'classnames';
import { throttleLead } from './utils/throttle';
import { nerve } from './utils/nerve';
import {
    setDraggedItem, getDraggedItem,
    setNearItem, getNearItem,
    getLandingContainer,
    setDraggedItemKey,
    setPosition, getPosition } from './services/dragService';

import './DragItem.less';

export class DragItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            renderPlaceholder: false,
            isDragged: false,
        };

        this.dragStart = (e) => {
            e.dataTransfer.effectAllowed = 'move';

            // Firefox requires calling dataTransfer.setData
            // for the drag to properly work
            e.dataTransfer.setData('text/html', e.currentTarget);

            // dragged task can't be set right after dragging started,
            // case it will trigger "display: none;" style and as a result it will stop dragging from happening
            setTimeout(() => {
                this.setState({
                    isDragged: true,
                });
            }, 16);

            const { dragStarted, item, $$key } = this.props;

            if (dragStarted) {
                dragStarted(e);
            }

            setDraggedItem(item);
            setDraggedItemKey($$key);
        };

        const setNewPosition = throttleLead((position) => {
            this.setState({
                renderPlaceholder: position,
            });
            setPosition(position);
        }, 50);

        this.dragOver = (e) => {
            clearTimeout(this.dropPlaceholderTimeoutId);
            this.dropPlaceholderTimeoutId = setTimeout(() => {
                this.setState({
                    renderPlaceholder: false,
                });
            }, 60);

            if (e.target.className.indexOf('drag-item__placeholder') > -1) return;

            const relY = e.clientY - e.target.offsetTop;
            const height = e.target.offsetHeight / 2;
            const position = relY > height ? 'after' : 'before';

            const { item } = this.props;
            setNearItem(item);

            setNewPosition(position);
        };

        this.dragEnd = (e) => {
            this.setState({
                isDragged: false,
            });

            const { dragStopped } = this.props;

            if (dragStopped) {
                dragStopped(e, {
                    item: getDraggedItem(),
                    container: getLandingContainer(),
                    nearItem: getNearItem(),
                    position: getPosition(), // before, after
                });
            }

            nerve.send({
                route: 'item/drag-end',
            });
        };
    }

    componentDidMount() {
        this.nerveId = nerve.on({
            route: 'item/drag-end',
            callback: () => {
                this.setState({
                    renderPlaceholder: false,
                });
                clearTimeout(this.dropPlaceholderTimeoutId);
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

        const dragItemClass = classnames({
            'drag-item-wrap': true,
            'drag-item-wrap_is-dragged': this.state.isDragged,
        });

        // `position` can be `before` or `after`
        const renderPlaceholder = (position) => {
            if (this.state.renderPlaceholder === position) {
                const placeholderClass = classnames({
                    'drag-item__placeholder': true,
                    [`drag-item__placeholder_${position}`]: true,
                });
                return (
                    <div className={placeholderClass} />
                );
            }
            return null;
        };

        return (
            <div className={dragItemClass}
                 draggable='true'
                 onDragOver={this.dragOver}
                 onDragStart={this.dragStart}
                 onDragEnd={this.dragEnd}>
                {renderPlaceholder('before')}
                <div className={className}>
                    {this.props.children}
                </div>
                {renderPlaceholder('after')}
            </div>
        );
    }
}

DragItem.propTypes = {
    dragStarted: React.PropTypes.func,
    dragStopped: React.PropTypes.func,
    item: React.PropTypes.any.isRequired,
    $$key: React.PropTypes.any,
};
