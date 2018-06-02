import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _isString from 'lodash/isString';
import SelectListItem from './SelectListItem';
import { SilectItemProp } from './SelectListProps';

import './SelectList.less';

class SelectList extends React.PureComponent {
    static getDerivedStateFromProps(props) {
        return {
            list: props.list
        }
    }

    constructor(props) {
        super(props);

        this.state = {
            dropdownIsVisible: false,
            list: props.list,
        };

        this.blurTimeout = null;
    }

    componentWillUnmount() {
        clearTimeout(this.blurTimeout);
    }

    handleInputChange = (e) => {
        const searchValue = e.target.value;
        if (searchValue !== '') {
            const regexp = new RegExp(searchValue, 'i');
            const newList = this.props.list.filter((item) => {
                for (const key in item) {
                    if (_isString(item[key])) {
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

    inputBlur = () => {
        // 'blur' is firing faster then 'click' event
        // therefore I need a timeout to make it work
        this.blurTimeout = setTimeout(() => {
            this.setState({
                dropdownIsVisible: false,
            });
        }, 200);
    };

    inputFocus = () => {
        this.setState({
            dropdownIsVisible: true,
        });
    };

    selectHandler = (item) => {
        const { onSelect } = this.props;
        onSelect && onSelect(item);
    };

    render() {
        const { placeholder } = this.props;
        const itemsClass = classnames({
            'select-list-items': true,
            'select-list-items_show': this.state.dropdownIsVisible,
        });

        return (
            <div className='select-list'>
                <input
                    className='flat-input select-list__input'
                    onFocus={this.inputFocus}
                    onBlur={this.inputBlur}
                    onChange={this.handleInputChange}
                    placeholder={placeholder}
                />
                <div className={itemsClass}>
                    {this.state.list.map(item => (
                        <SelectListItem
                            item={item}
                            key={`dropdown-item-${item.id}`}
                            onClick={this.selectHandler}
                        />
                    ))}
                </div>
            </div>
        );
    }
}

SelectList.propTypes = {
    list: PropTypes.arrayOf(SilectItemProp).isRequired,
    onSelect: PropTypes.func,
};

SelectList.defaultProps = {
    onSelect: null,
};

export default SelectList;
