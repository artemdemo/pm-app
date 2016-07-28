import React, { Component } from 'react';
import MainMenu from '../components/MainMenu/MainMenu';
import ProjectsList from '../components/ProjectsList/ProjectsList';

import './list-container.less';

export class ProjectsView extends Component {
    render() {
        const classView = 'list-container';
        return (
            <div>
                <MainMenu />

                <div className={classView}>
                    <div className='list-container__list'>
                        <ProjectsList />
                    </div>
                    <div className='list-container__panel'>

                    </div>
                </div>
            </div>
        );
    }
}
