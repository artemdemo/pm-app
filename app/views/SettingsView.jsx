import React, {Component} from 'react';
import { connect } from 'react-redux';
import MainMenu from '../components/MainMenu/MainMenu';

class SettingsView extends Component {
    render() {

        return (
            <div>
                <MainMenu />

                <div className='list-container'>
                    <div className='list-container__list'>
                        <h4>Settings</h4>
                        <p></p>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    () => {
        return {};
    }
)(SettingsView);
