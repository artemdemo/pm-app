import React from 'react';
import { connect } from 'react-redux';

const SettingsView = () => {
    return (
        <React.Fragment>
            <h4>Settings</h4>
            <p />
        </React.Fragment>
    );
};

export default connect(
    () => ({})
)(SettingsView);
