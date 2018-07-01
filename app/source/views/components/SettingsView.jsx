import React from 'react';
import { connect } from 'react-redux';

const SettingsView = () => {
    return (
        <React.Fragment>
            <h4>Settings</h4>
            <div className='row'>
                <div className='col-md-4'>
                    <div className='form-group'>
                        <label htmlFor='languageInput'>Language</label>
                        <select id='languageInput' className='form-control'>
                            <option selected>En</option>
                            <option>Ru</option>
                        </select>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default connect(
    () => ({})
)(SettingsView);
