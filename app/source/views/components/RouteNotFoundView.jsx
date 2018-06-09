import React from 'react';
import * as location from '../../services/location';

import '../styles/RouteNotFoundView.less';

const RouteNotFoundView = () => {
    return (
        <div className='route-not-found-view'>
            <p>
                Route Not Found
            </p>
            <button
                className='btn btn-primary'
                onClick={() => location.replace('/')}
            >
                Back to Home
            </button>
        </div>
    );
};

export default RouteNotFoundView;
