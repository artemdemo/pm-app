import React, {Component} from 'react';

export class LoginView extends Component {
    submitLogin() {
        console.log('Submitting login');
    }

    render() {
        return (
            <div className="container">
                <form className="form-signin" onSubmit={this.submitLogin}>
                    <h2 className="form-signin-heading">Please sign in</h2>
                    <label htmlFor="inputEmail" className="sr-only">
                        Email address
                    </label>
                    <input type="email"
                           name="email"
                           className="form-control form-signin__first-input"
                           placeholder="Email address"
                           required=""
                           autoFocus=""
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
                        Login
                    </button>
                    <a className="btn btn-link btn-block">
                        Create new account - sign up
                    </a>
                </form>
            </div>
        );
    }
}
