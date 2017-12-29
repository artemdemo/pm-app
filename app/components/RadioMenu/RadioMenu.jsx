import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { RadioMenuItem } from './RadioMenuItem';

import './RadioMenu.less';

export class RadioMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedList: props.list.map((item, i) => {
                return Object.assign(item, {
                    $$selected: i === 0,
                });
            }),
        };

        this.selectItem = (selectedItem) => {
            const { onSelect } = this.props;
            this.setState({
                selectedList: this.state.selectedList.map((item) => {
                    return Object.assign(item, {
                        $$selected: selectedItem.id === item.id,
                    });
                }),
            });
            onSelect(selectedItem);
        };
    }

    render() {
        return (
            <div className='radio-menu'>
                {this.state.selectedList.map(item => (
                    <RadioMenuItem
                        item={item}
                        selected={item.$$selected}
                        onClick={() => this.selectItem(item)}
                        key={`radio-menu-item-${item.id}`}
                    />
                ))}
            </div>
        );
    }
}

RadioMenu.propTypes = {
    list: PropTypes.arrayOf(PropTypes.object),
    onSelect: PropTypes.func,
};
