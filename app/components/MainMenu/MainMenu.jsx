import React, { Component } from 'react';
import {Link} from 'react-router';

import './MainMenu.less';

export class MainMenu extends Component {
    logOut() {
        console.log('Logout');
    }

    render() {
        return (
            <nav className="navbar navbar-default">
                <div className="container">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <a className="navbar-brand" href="/">&lt;PM&gt;</a>
                    </div>
                    <div id="navbar" className="collapse navbar-collapse">
                        <ul className="nav navbar-nav">
                            <li><Link to="/tasks" className="navbar-link">Tasks</Link></li>
                            <li><Link to="/scrum" className="navbar-link">Scrum</Link></li>
                            <li><Link to="/projects" className="navbar-link">Projects</Link></li>
                        </ul>
                        <ul className="nav navbar-nav navbar-right">
                            <li><span className="navbar-link"
                                      onClick={this.logOut}
                                      data-qa="logout-main-menu-button">Logout</span></li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}
