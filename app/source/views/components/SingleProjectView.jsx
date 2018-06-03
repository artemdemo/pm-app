import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import EntityModal from '../../components/EntityModal/EntityModal';
import * as location from '../../services/location';

class SingleProjectView extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            description: '',
        };
    }

    submitProject = () => {};

    deleteProject = () => {};

    render() {
        return (
            <EntityModal>
                <div className='form-group'>
                    <input
                        type='text'
                        className='form-control'
                        placeholder='Project name'
                        onChange={e => this.setState({name: e.target.value})}
                        value={this.state.name}
                    />
                </div>
                <div className='form-group'>
                    <textarea
                        className='form-control'
                        placeholder='Project description'
                        rows='3'
                        onChange={e => this.setState({description: e.target.value})}
                        value={this.state.description}
                    />
                </div>

                <div className='row justify-content-between'>
                    <div className='col-6'>
                        <span className='buttons-group'>
                            <button
                                className='btn btn-primary'
                                onClick={this.submitProject}
                            >
                                Save
                            </button>
                            <Link
                                className='btn btn-light'
                                to={location.wrapUrl('/projects')}
                            >
                                Close
                            </Link>
                        </span>
                    </div>
                    <div className='col-4'>
                        <button
                            className='btn btn-danger'
                            onClick={this.deleteTask}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </EntityModal>
        );
    }
}

export default connect(
    state => ({
        projects: state.projects,
    })
)(SingleProjectView);
