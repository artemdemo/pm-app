import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import MarkdownIt from 'markdown-it';
import markdownItEmoji from 'markdown-it-emoji';
import Icon from '../../components/Icon/Icon';

import './TextareaMd.less';

class TextareaMd extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            value: '',
            editMode: false,
        };

        this.md = new MarkdownIt();
        this.md.use(markdownItEmoji);
    }

    componentWillMount() {
        const { value } = this.props;
        const newState = {
            value,
        };
        if (value.length === 0) {
            newState.editMode = true;
        }
        this.setState(newState);
    }

    componentWillReceiveProps(nextProps) {
        const { value } = nextProps;
        this.setState({
            value,
        });
    }

    togglePreview() {
        this.setState({
            editMode: !this.state.editMode,
        });
    }

    render() {
        const { className, name, rows, placeholder } = this.props;
        const dataQa = this.props['data-qa'];
        const editorClass = classnames({
            'textarea-md-editor': true,
            hidden: !this.state.editMode,
        });
        const contentClass = classnames({
            'textarea-md-content': true,
            hidden: this.state.editMode,
        });
        const renderedContent = this.md.render(this.state.value).trim();
        const renderMd = () => {
            return {
                __html: renderedContent,
            };
        };
        const renderPlaceholder = () => {
            if (this.state.value === '') {
                return (
                    <div className='textarea-md-content__placeholder'>
                        {placeholder}
                    </div>
                );
            }
            return null;
        };
        return (
            <div
                className='textarea-md'
                data-qa={dataQa}
            >
                <div className={editorClass}>
                    <div
                        className='textarea-md-content__preview'
                        onClick={this.togglePreview.bind(this)}
                        data-qa={`${dataQa}__preview`}
                    >
                        <Icon name='eye-open' />
                    </div>
                    <textarea
                        className={className}
                        name={name}
                        rows={rows}
                        value={this.state.value}
                        onChange={(e) => {
                            this.setState({
                                value: e.target.value,
                            });
                            if (this.props.onChange) {
                                this.props.onChange(e);
                            }
                        }}
                        placeholder={placeholder}
                        data-qa={`${dataQa}__textarea`}
                    />
                </div>
                <div className={contentClass}>
                    <div
                        className='textarea-md-content__edit'
                        onClick={this.togglePreview}
                        data-qa={`${dataQa}__edit-content`}
                    >
                        <Icon name='pencil' />
                    </div>
                    {renderPlaceholder()}
                    <div
                        className='textarea-md-content__rendered'
                        dangerouslySetInnerHTML={renderMd()}
                        data-qa={`${dataQa}__rendered`}
                    />
                </div>
            </div>
        );
    }
}

TextareaMd.propTypes = {
    className: PropTypes.string,
    value: PropTypes.string,
    name: PropTypes.string,
    rows: PropTypes.string,
    placeholder: PropTypes.string,
    'data-qa': PropTypes.string,
    onChange: PropTypes.func,
};

TextareaMd.defaultProps = {
    className: '',
    value: '',
    name: '',
    rows: 3,
    placeholder: '',
    'data-qa': '',
    onChange: null,
};

export default TextareaMd;
