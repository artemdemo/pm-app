import React from 'react';
import { connect } from 'react-redux';

const SettingsView = () => {
    return (
        <div className='list-container'>
            <div className='list-container__list'>
                <h4>Settings</h4>
                <p />
            </div>
        </div>
    );
};

export default connect(
    () => ({})
)(SettingsView);
