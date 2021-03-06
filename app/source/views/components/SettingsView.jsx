import React from 'react';
import { connect } from 'react-redux';
import { Translate } from 'react-localize-redux';
import SelectLanguage from '../../containers/SettingsView/SelectLanguage';

class SettingsView extends React.PureComponent {
    render() {
        return (
            <React.Fragment>
                <h4><Translate id='settings' /></h4>
                <div className='row'>
                    <div className='col-md-4'>
                        <SelectLanguage />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default connect(
    () => ({})
)(SettingsView);
