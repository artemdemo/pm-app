import React, { Component } from 'react';
import classnames from 'classnames';
import MarkdownIt from 'markdown-it';
import markdownItEmoji from 'markdown-it-emoji';

import './TextareaMd.less';

export class TextareaMd extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editMode: false,
            value: '',
        };

        this.md = new MarkdownIt();
        this.md.use(markdownItEmoji);

        this.togglePreview = () => {
            this.setState({
                editMode: !this.state.editMode,
            });
        };
    }

    componentWillReceiveProps(nextProps) {
        const { value = '' } = nextProps;
        this.setState({
            value,
        });
    }

    render() {
        const { className = '', name = '', rows = 3, placeholder } = this.props;
        const dataQa = this.props['data-qa'] ? this.props['data-qa'] : '';
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
            if (renderedContent === '' && placeholder) {
                return (
                    <div className='text-muted'>
                        {placeholder}
                    </div>
                );
            }
            return null;
        };
        return (
            <div className='textarea-md'
                 data-qa={dataQa}>
                <div className={editorClass}>
                    <div className='textarea-md-content__preview'
                         onClick={this.togglePreview}
                         data-qa={`${dataQa}__preview`}>
                        <span className='glyphicon glyphicon-eye-open'></span>
                    </div>
                    <textarea className={className}
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
                              data-qa={`${dataQa}__textarea`}></textarea>
                    <div className='textarea-md-editor__post-text'>
                        <a href='http://www.webpagefx.com/tools/emoji-cheat-sheet/' target='_blank'>
                            emoji
                        </a>
                    </div>
                </div>
                <div className={contentClass}>
                    <div className='textarea-md-content__edit'
                         onClick={this.togglePreview}
                         data-qa={`${dataQa}__edit-content`}>
                        <span className='glyphicon glyphicon-pencil'></span>
                    </div>
                    {renderPlaceholder()}
                    <div className='textarea-md-content__rendered'
                         dangerouslySetInnerHTML={renderMd()}
                         data-qa={`${dataQa}__rendered`}></div>
                </div>
            </div>
        );
    }
}

TextareaMd.propTypes = {
    className: React.PropTypes.string,
    value: React.PropTypes.string,
    name: React.PropTypes.string,
    rows: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    'data-qa': React.PropTypes.string,
    onChange: React.PropTypes.func,
};
