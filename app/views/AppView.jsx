import React, { Component } from 'react';

export class AppView extends Component {
    render() {
        return (
            <div className='app'>
                {this.props.children}
            </div>
        );
    }
}
