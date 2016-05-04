import {Component} from '@angular/core';

@Component({
    selector: 'login-page',
    directives: [],
    template: `
        <div class="container">

        <form class="form-signin">
            <h2 class="form-signin-heading">Please sign in</h2>
            <label for="inputEmail" class="sr-only">
                Email address
            </label>
            <input type="email"
                   class="form-control form-signin__first-input"
                   placeholder="Email address"
                   required=""
                   autofocus=""
                   autocomplete="off">
            <label for="inputPassword" class="sr-only">
                Password
            </label>
            <input type="password"
                   class="form-control form-signin__last-input"
                   placeholder="Password"
                   required=""
                   autocomplete="off">
            <div class="checkbox">
                <label>
                    <input type="checkbox" value="remember-me"> Remember me
                </label>
            </div>
            <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
        </form>

        </div>
    `,
})
export class LoginPage {
}
