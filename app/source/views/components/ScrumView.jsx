import React from 'react';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import BoardsList from '../../containers/BoardsList/BoardsList';

import '../list-container.less';

const ScrumView = () => {
    return (
        <div className='list-container'>
            <div className='list-container__list'>
                <ErrorBoundary componentName='BoardsList'>
                    <BoardsList />
                </ErrorBoundary>
            </div>
        </div>
    );
};

export default ScrumView
