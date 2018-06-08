import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import clickOutside from 'react-click-outside';
import Icon from '../../components/Icon/Icon';

import './BoardMenu.less';

export const menuItemsMap = {
    MOVE_LEFT: 'MOVE_LEFT',
    MOVE_RIGHT: 'MOVE_RIGHT',
    EDIT: 'EDIT',
};

class BoardMenu extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showDropdown: false,
        };
    }

    handleClickOutside = () => {
        this.setState({
            showDropdown: false,
        });
    };

    handleIconClick = () => {
        this.setState({
            showDropdown: true,
        });
    };

    handleMenuClick(itemName) {
        const { onClick } = this.props;
        onClick && onClick(itemName);
        this.setState({
            showDropdown: false,
        });
    }

    renderMoveRight() {
        const { disableRight } = this.props;
        if (!disableRight) {
            return (
                <span
                    className='dropdown-item'
                    onClick={this.handleMenuClick.bind(this, menuItemsMap.MOVE_RIGHT)}
                >
                    Move right
                </span>
            );
        }
        return null;
    }

    renderMoveLeft() {
        const { disableLeft } = this.props;
        if (!disableLeft) {
            return (
                <span
                    className='dropdown-item'
                    onClick={this.handleMenuClick.bind(this, menuItemsMap.MOVE_LEFT)}
                >
                    Move left
                </span>
            );
        }
        return null;
    }

    render() {
        const dropdownClass = classnames({
            'dropdown-menu': true,
            show: this.state.showDropdown,
        });
        return (
            <div className='board-menu'>
                <div
                    className='board-menu__icon'
                    onClick={this.handleIconClick}
                >
                    <Icon name='ellipsis-v' type='solid' />
                </div>
                <div className={dropdownClass}>
                    {this.renderMoveRight()}
                    {this.renderMoveLeft()}
                    <div className='dropdown-divider' />
                    <span
                        className='dropdown-item'
                        onClick={this.handleMenuClick.bind(this, menuItemsMap.EDIT)}
                    >
                        Edit
                    </span>
                </div>
            </div>
        );
    }
}

BoardMenu.propTypes = {
    onClick: PropTypes.func,
    disableLeft: PropTypes.bool,
    disableRight: PropTypes.bool,
};

BoardMenu.defaultProps = {
    onClick: null,
    disableLeft: false,
    disableRight: false,
};

export default clickOutside(BoardMenu);
