import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Translate } from 'react-localize-redux';
import EntityModal from '../../components/EntityModal/EntityModal';
import EntityControllers from '../../components/EntityControllers/EntityControllers';
import * as location from '../../services/location';

class PlanTasksView extends React.PureComponent {
    render() {
        return (
            <Translate>
                {({ translate }) => (
                    <React.Fragment>
                        <EntityModal title={translate('plan-tasks')}>
                            <p>
                                <strong>{translate('selected-tasks')}</strong>
                            </p>

                            <p>
                                <strong>{translate('backlog-tasks')}</strong>
                            </p>

                            <EntityControllers
                                onSave={this.submitBoard}
                                onClose={() => location.push('/scrum')}
                                onDelete={this.deleteBoard}
                            />
                        </EntityModal>
                    </React.Fragment>
                )}
            </Translate>
        );
    }
}

export default connect()(PlanTasksView);
