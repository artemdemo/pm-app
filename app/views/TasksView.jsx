import React, { Component } from 'react';
import  classnames from 'classnames';
import { MainMenu } from '../components/MainMenu/MainMenu';
import TasksList from '../components/TasksList/TasksList';
import { SingleTask } from '../components/SingleTask/SingleTask';

import './list-container.less';

export class TasksView extends Component {
    render() {
        const classView = classnames({
            'list-container': true,
            'list-container_open-right-panel': false
        });
        return (
            <div>
                <MainMenu />

                <div className={classView}>
                    <div className='list-container__list'>
                        <TasksList />
                    </div>
                    <div className='list-container__panel'>
                        <SingleTask />
                    </div>
                </div>
            </div>
        );
    }
}
