import React, {Component} from 'react';
import {Link} from 'react-router';

import './form-signin.less';

export class SignupView extends Component {
    submitSignup() {
        console.log('Submitting signup');
    }

    render() {
        return (
            <div className="container">
                <form className="form-signin" onSubmit={this.submitSignup}>
                    <h2 className="form-signin-heading">Sign up</h2>
                    <label htmlFor="inputUsername" className="sr-only">
                        Username
                    </label>
                    <input type="text"
                           name="username"
                           className="form-control form-signin__first-input"
                           placeholder="Username"
                           required=""
                           autoFocus=""
                           autoComplete="off" />
                    <label htmlFor="inputEmail" className="sr-only">
                        Email address
                    </label>
                    <input type="email"
                           name="email"
                           className="form-control form-signin__input"
                           placeholder="Email address"
                           required=""
                           autoComplete="off" />
                    <label htmlFor="inputPassword" className="sr-only">
                        Password
                    </label>
                    <input type="password"
                           name="password"
                           className="form-control form-signin__last-input"
                           placeholder="Password"
                           required=""
                           autoComplete="off" />
                    <div className="checkbox">
                        <label>
                            <input type="checkbox"
                                   name="remember"
                                   value="remember-me" /> Remember me
                        </label>
                    </div>
                    <button className="btn btn-lg btn-primary btn-block"
                            type="submit">
                        Sign up
                    </button>
                    <Link to="/login" className="btn btn-link btn-block">
                        I have an account - login
                    </Link>
                </form>
            </div>
        );
    }
}
