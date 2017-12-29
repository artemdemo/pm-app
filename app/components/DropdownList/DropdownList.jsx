import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { DropdownListItem } from './DropdownListItem';

import './DropdownList.less';

export class DropdownList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dropdownIsVisible: false,
            list: props.list,
        };

        this.inputFocus = () => {
            this.setState({
                dropdownIsVisible: true,
            });
        };

        this.inputBlur = () => {
            // 'blur' is firing faster then 'click' event
            // therefore I need a timeout to make it work
            setTimeout(() => {
                this.setState({
                    dropdownIsVisible: false,
                });
            }, 200);
        };

        this.handleInputChange = (e) => {
            const searchValue = e.target.value;
            if (searchValue !== '') {
                const regexp = new RegExp(searchValue, 'i');
                const newList = this.props.list.filter((item) => {
                    for (const key in item) {
                        if (typeof item[key] === 'string') {
                            return item[key].match(regexp);
                        }
                    }
                    return false;
                });
                this.setState({
                    list: newList,
                });
            } else {
                this.setState({
                    list: this.props.list,
                });
            }
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            list: nextProps.list,
        });
    }

    render() {
        const { placeholder, onSelect } = this.props;
        const itemsClass = classnames({
            'dropdown-list-items': true,
            'dropdown-list-items_show': this.state.dropdownIsVisible,
        });
        return (
            <div className='dropdown-list'>
                <input className='flat-input dropdown-list__input'
                    onFocus={this.inputFocus}
                    onBlur={this.inputBlur}
                    onChange={this.handleInputChange}
                    placeholder={placeholder} />
                <div className={itemsClass}>
                    {this.state.list.map(item => (
                        <DropdownListItem item={item}
                            key={`dropdown-item-${item.id}`}
                            onClick={() => onSelect(item)} />
                    ))}
                </div>
            </div>
        );
    }
}

DropdownList.propTypes = {
    list: PropTypes.arrayOf(PropTypes.object).isRequired,
    onSelect: PropTypes.func,
};
