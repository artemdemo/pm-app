import React, { Component } from 'react';
import { MainMenu } from '../components/MainMenu/MainMenu';
import { TasksList } from '../components/TasksList/TasksList';

import './list-container.less';

export class TasksView extends Component {
    render() {
        const classView = 'list-container';
        return (
            <div>
                <MainMenu />

                <div className={classView}>
                    <div className='list-container__list'>
                        <TasksList />
                    </div>
                    <div className='list-container__panel'>

                    </div>
                </div>
            </div>
        );
    }
}
