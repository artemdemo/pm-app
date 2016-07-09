import React, { Component } from 'react';
import { MainMenu } from '../components/MainMenu/MainMenu';
import { push, routeActions } from 'react-router-redux';
import { history } from '../configs';

import './list-container.less';

export class TasksView extends Component {
    render() {
        const classView = 'list-container';
        return (
            <div>
                <MainMenu></MainMenu>

                <div className="list-container">
                    <div className="list-container__list">

                    </div>
                    <div className="list-container__panel">

                    </div>
                </div>
            </div>
        );
    }
}
