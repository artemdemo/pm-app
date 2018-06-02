import React from 'react';

import './EntityModal.less';

class EntityModal extends React.PureComponent {
    render() {
        return (
            <div className='entity-modal'>
                {this.props.children}
            </div>
        );
    }
}

export default EntityModal;
