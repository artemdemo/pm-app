import React from 'react';
import PropTypes from 'prop-types';
import RadioMenuItem from './RadioMenuItem';

class RadioMenu extends React.PureComponent {
    selectItem = (item) => {
        const { onChange } = this.props;
        onChange && onChange(item);
    };

    render() {
        const { list, selectedItem } = this.props;
        return (
            <div className='btn-group' role='group'>
                {list.map(item => (
                    <RadioMenuItem
                        item={item}
                        selected={item === selectedItem}
                        onClick={this.selectItem}
                        key={`radio-menu-item-${item.value}`}
                    />
                ))}
            </div>
        );
    }
}

RadioMenu.propTypes = {
    list: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        name: PropTypes.string,
    })),
    onChange: PropTypes.func,
    selectedItem: PropTypes.shape({}),
};

RadioMenu.defaultProps = {
    list: [],
    onChange: null,
    selectedItem: null,
};

export default RadioMenu;
