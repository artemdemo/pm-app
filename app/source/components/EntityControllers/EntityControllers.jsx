import React from 'react';
import PropTypes from 'prop-types';
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

    render() {
        return (
            <div className='row justify-content-between'>
                <div className='col-6'>
                    <ElementsRow>
                        <button
                            className='btn btn-primary'
                            onClick={this.handleSave}
                        >
                            Save
                        </button>
                        <button
                            className='btn btn-light'
                            onClick={this.handleClose}
                        >
                            Close
                        </button>
                    </ElementsRow>
                </div>
                <div className='col-4'>
                    <button
                        className='btn btn-danger'
                        onClick={this.handleDelete}
                    >
                        Delete
                    </button>
                </div>
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
