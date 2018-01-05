import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Icon from '../../components/Icon/Icon';

import './InputMd.less';

class InputMd extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            value: props.value,
        };
    }

    componentWillReceiveProps(nextProps) {
        const { value = '' } = nextProps;
        const newState = {
            value,
        };
        this.setState(newState);
    }

    changeValue(e) {
        const { onChange } = this.props;
        this.setState({
            value: e.target.value,
        });
        onChange && onChange(e);
    }

    togglePreview() {
        this.setState({
            editMode: !this.state.editMode,
        });
    }

    render() {
        const { className, name, autoComplete, type, placeholder } = this.props;
        const dataQa = this.props['data-qa'] ? this.props['data-qa'] : '';
        const editorClass = classnames({
            'input-md-editor': true,
            hidden: !this.state.editMode,
        });
        const contentClass = classnames({
            'input-md-content': true,
            hidden: this.state.editMode,
        });
        return (
            <div
                className='input-md'
                data-qa={dataQa}
            >
                <div className={editorClass}>
                    <div
                        className='input-md-content__preview'
                        onClick={this.togglePreview.bind(this)}
                        data-qa={`${dataQa}__preview`}
                    >
                        <Icon name='eye-open' />
                    </div>
                    <input
                        type={type}
                        name={name}
                        value={this.state.value}
                        onChange={this.changeValue.bind(this)}
                        className={className}
                        placeholder={placeholder}
                        autoComplete={autoComplete}
                        data-qa={`${dataQa}__input`}
                    />
                </div>
                <div className={contentClass}>
                    <div
                        className='input-md-content__edit'
                        onClick={this.togglePreview.bind(this)}
                        data-qa={`${dataQa}__edit-content`}
                    >
                        <Icon name='pencil' />
                    </div>
                    <div
                        className='input-md-content__rendered'
                        data-qa={`${dataQa}__rendered`}
                    >
                        {this.state.value}
                    </div>
                </div>
            </div>
        );
    }
}

InputMd.propTypes = {
    className: PropTypes.string,
    value: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    placeholder: PropTypes.string,
    autoComplete: PropTypes.string,
    'data-qa': PropTypes.string,
    onChange: PropTypes.func,
};

InputMd.defaultProps = {
    className: '',
    name: '',
    value: '',
    autoComplete: 'off',
    placeholder: '',
    type: 'text',
    onChange: null,
    'data-qa': undefined,
};

export default InputMd;
