import React from 'react';
import { connect } from 'react-redux';

class SettingsView extends React.PureComponent {
    constructor(props) {
        super(props);

        this.languages = [
            {value: 'en', name: 'En'},
            {value: 'ru', name: 'Ru'},
        ];

        this.state = {
            selectedLng: this.languages[0].value,
        };
    }

    render() {
        return (
            <React.Fragment>
                <h4>Settings</h4>
                <div className='row'>
                    <div className='col-md-4'>
                        <div className='form-group'>
                            <label htmlFor='languageInput'>Language</label>
                            <select
                                id='languageInput'
                                className='form-control'
                                value={this.state.selectedLng}
                                onChange={e => this.setState({ selectedLng: e.target.value })}
                            >
                                {this.languages.map(lng => (
                                    <option
                                        value={lng.value}
                                        key={`languages-item-${lng.value}`}
                                    >
                                        {lng.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default connect(
    () => ({})
)(SettingsView);
