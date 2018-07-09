import React from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';
import ElementsRow from '../../components/ElementsRow/ElementsRow';

class EntityControllers extends React.PureComponent {
    handleSave = () => {
        const { onSave } = this.props;
        onSave && onSave();
    };

    handleClose = () => {
        const { onClose } = this.props;
        onClose && onClose();
    };

    handleDelete = () => {
        const { onDelete } = this.props;
        onDelete && onDelete();
    };

    renderDelete() {
        const { onDelete } = this.props;
        if (onDelete) {
            return (
                <button
                    className='btn btn-danger'
                    onClick={this.handleDelete}
                >
                    <Translate id='delete' />
                </button>
            );
        }
        return null;
    }

    render() {
        return (
            <div className='d-flex mb-2'>
                <ElementsRow className='mr-auto'>
                    <button
                        className='btn btn-primary'
                        onClick={this.handleSave}
                    >
                        <Translate id='save' />
                    </button>
                    <button
                        className='btn btn-light'
                        onClick={this.handleClose}
                    >
                        <Translate id='close' />
                    </button>
                </ElementsRow>
                {this.renderDelete()}
            </div>
        );
    }
}

EntityControllers.propTypes = {
    onSave: PropTypes.func,
    onClose: PropTypes.func,
    onDelete: PropTypes.func,
};

EntityControllers.defaultProps = {
    onSave: null,
    onClose: null,
    onDelete: null,
};

export default EntityControllers;
