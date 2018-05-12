import React from 'react';
import { connect } from 'react-redux';
import MainMenu from '../../containers/MainMenu/MainMenu';

const SettingsView = () => {
    return (
        <div>
            <MainMenu />

            <div className='list-container'>
                <div className='list-container__list'>
                    <h4>Settings</h4>
                    <p />
                </div>
            </div>
        </div>
    );
};

export default connect(
    () => ({})
)(SettingsView);
