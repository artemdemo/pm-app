import React from 'react';
import PropTypes from 'prop-types';
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

export class DragItem extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            renderPlaceholder: false,
            isDragged: false,
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

    dragStart = (e) => {
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

        dragStarted && dragStarted(e);

        setDraggedItem(item);
        setDraggedItemKey($$key);
    };

    dragEnd = () => {
        this.setState({
            isDragged: false,
        });

        const { dragStopped } = this.props;

        if (dragStopped) {
            dragStopped({
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

    // `position` can be `before` or `after`
    renderPlaceholder(position) {
        const { placeholderClass } = this.props;
        if (this.state.renderPlaceholder === position) {
            const placeholderClassName = classnames(placeholderClass, {
                'drag-item__placeholder': true,
                [`drag-item__placeholder_${position}`]: true,
            });
            return (
                <div className={placeholderClassName} />
            );
        }
        return null;
    }

    render() {
        const { className = '' } = this.props;

        const dragItemClass = classnames({
            'drag-item-wrap': true,
            'drag-item-wrap_is-dragged': this.state.isDragged,
        });

        return (
            <div
                className={dragItemClass}
                draggable='true'
                onDragOver={this.dragOver}
                onDragStart={this.dragStart}
                onDragEnd={this.dragEnd}
            >
                {this.renderPlaceholder('before')}
                <div className={className}>
                    {this.props.children}
                </div>
                {this.renderPlaceholder('after')}
            </div>
        );
    }
}

DragItem.propTypes = {
    dragStarted: PropTypes.func,
    dragStopped: PropTypes.func,
    item: PropTypes.number.isRequired,
    placeholderClass: PropTypes.string,
    $$key: PropTypes.string,
};

DragItem.defaultProps = {
    dragStarted: null,
    dragStopped: null,
    placeholderClass: '',
    $$key: null,
};
