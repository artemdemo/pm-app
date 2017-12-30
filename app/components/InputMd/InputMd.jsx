import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import emoji from '../../utils/emoji/emoji';

import './InputMd.less';

class InputMd extends React.PureComponent {
    constructor(props) {
        super(props);

        const { editMode } = props;

        this.state = {
            value: props.value,
            editMode,
        };
    }

    componentWillReceiveProps(nextProps) {
        const { value = '', editMode } = nextProps;
        const newState = {
            value,
        };
        if (editMode !== undefined) {
            newState.editMode = editMode;
        }
        this.setState(newState);
    }

    togglePreview() {
        this.setState({
            editMode: !this.state.editMode,
        });
    }

    render() {
        const { className, name = '', autoComplete = 'off', type = 'text', placeholder } = this.props;
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
                        <span className='glyphicon glyphicon-eye-open' />
                    </div>
                    <input
                        type={type}
                        name={name}
                        value={this.state.value}
                        onChange={(e) => {
                            this.setState({
                                value: e.target.value,
                            });
                            if (this.props.onChange) {
                                this.props.onChange(e);
                            }
                        }}
                        className={className}
                        placeholder={placeholder}
                        autoComplete={autoComplete}
                        data-qa={`${dataQa}__input`}
                    />
                </div>
                <div className={contentClass}>
                    <div
                        className='input-md-content__edit'
                        onClick={this.togglePreview}
                        data-qa={`${dataQa}__edit-content`}
                    >
                        <span className='glyphicon glyphicon-pencil' />
                    </div>
                    <div className='input-md-content__rendered'
                        data-qa={`${dataQa}__rendered`}>
                        {emoji(this.state.value)}
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
    editMode: PropTypes.bool,
};

InputMd.defaultProps = {
    className: '',
    name: '',
    value: '',
    autoComplete: 'off',
    placeholder: '',
    type: 'text',
    editMode: false,
    onChange: null,
    'data-qa': undefined,
};

export default InputMd;
