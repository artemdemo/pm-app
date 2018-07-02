import React from 'react';
import { withLocalize } from 'react-localize-redux';
import { renderToStaticMarkup } from 'react-dom/server';
import enTranslations from '../../translations/en.translations.json';
import ruTranslations from '../../translations/ru.translations.json';
import LoginController from '../../controllers/LoginController';
import Notificator from '../../components/Notificator/Notificator';
import MainMenu from '../../containers/MainMenu/MainMenu';
import auth from '../../services/auth';

class AppView extends React.PureComponent {
    constructor(props) {
        super(props);

        this.props.initialize({
            languages: [
                { name: 'English', code: 'en' },
                { name: 'Russian', code: 'ru' },
            ],
            options: {
                renderToStaticMarkup,
            }
        });

        this.props.addTranslationForLanguage(enTranslations, 'en');
        this.props.addTranslationForLanguage(ruTranslations, 'ru');
    }

    renderMenu() {
        if (auth.isAuthorized()) {
            return (
                <MainMenu />
            );
        }
        return null;
    }

    render() {
        return (
            <React.Fragment>
                {this.renderMenu()}

                <LoginController />

                <div className='container'>
                    {this.props.children}
                </div>
                <Notificator />
            </React.Fragment>
        );
    }
}


export default withLocalize(AppView);
