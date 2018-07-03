import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Translate } from 'react-localize-redux';

class RadioMenuItem extends React.PureComponent {
    handleClick = () => {
        const { item, onClick } = this.props;
        onClick && onClick(item)
    };

    render() {
        const { item, selected } = this.props;
        const itemClass = classnames({
            btn: true,
            'btn-outline-info': !selected,
            'btn-info': selected,
        });
        return (
            <button
                className={itemClass}
                onClick={this.handleClick}
            >
                <Translate id={item.value}>{item.name}</Translate>
            </button>
        );
    }
}

RadioMenuItem.propTypes = {
    item: PropTypes.shape({}),
    selected: PropTypes.bool,
    onClick: PropTypes.func,
};

RadioMenuItem.defaultProps = {
    item: {},
    selected: false,
    onClick: null,
};

export default RadioMenuItem;
