import React from 'react';
import { Translate } from 'react-localize-redux';
import { withLocalize } from 'react-localize-redux';

class SelectLanguage extends React.PureComponent {
    constructor(props) {
        super(props);

        this.languages = [
            {value: 'en', name: 'En'},
            {value: 'ru', name: 'Ru'},
        ];
    }

    onChangeLanguage = (e) => {
        const { setActiveLanguage } = this.props;
        const { value } = e.target;
        setActiveLanguage(value);
    };

    render() {
        const { activeLanguage } = this.props;
        console.log(activeLanguage);
        return (
            <div className='form-group'>
                <label htmlFor='languageInput'>
                    <Translate id='language' />
                </label>
                <select
                    id='languageInput'
                    className='form-control'
                    onChange={this.onChangeLanguage}
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
        );
    }
}

export default withLocalize(SelectLanguage);
