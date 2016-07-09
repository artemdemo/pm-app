import React, { Component } from 'react';
import {connect} from 'react-redux';
import {MainMenu} from '../components/MainMenu/MainMenu';
import {checkIfHasToken} from '../actions/user';

export class AppView extends Component {
    constructor(props) {
        super(props);
        checkIfHasToken();
    }

    render() {
        return (
            <div className='app'>
                {this.props.children}
            </div>
        );
    }
}


export default connect(
    state => {
        return {}
    },
    {
        checkIfHasToken
    }
)(AppView);
