import React, {Component} from 'react';
import MainMenu from '../components/MainMenu/MainMenu';

export class MainView extends Component {
    render() {
        return (
            <div>
                <MainMenu />

                <div className='list-container'>
                    <div className='list-container__list'>
                        <h4>Tasks</h4>
                        <p>
                            Total: <br/>
                            In process: <br/>
                            Done: <br/>
                        </p>

                        <h4>Projects</h4>
                        <p>
                            Total: <br/>
                            In process: <br/>
                            Done: <br/>
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}
