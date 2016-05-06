import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';

@Component({
    selector: 'signup-page',
    directives: [ROUTER_DIRECTIVES],
    template: `
        <div class="container">
            <form class="form-signin">
                <h2 class="form-signin-heading">Sign up</h2>
                <label for="inputUsername" class="sr-only">
                    Username
                </label>
                <input type="text"
                       class="form-control form-signin__first-input"
                       placeholder="Username"
                       required=""
                       autofocus=""
                       autocomplete="off">
                <label for="inputEmail" class="sr-only">
                    Email address
                </label>
                <input type="email"
                       class="form-control form-signin__input"
                       placeholder="Email address"
                       required=""
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
                <button class="btn btn-lg btn-primary btn-block"
                        type="submit">
                    Sign up
                </button>
                <a class="btn btn-link btn-block"
                   [routerLink]="['LoginPage']">
                    I have an account - login
                </a>
            </form>
        </div>
    `,
})
export class SignupPage {
}
