import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router-deprecated';
import {AuthorizationService, Signup} from '../services/AuthorizationService';

@Component({
    selector: 'signup-page',
    directives: [ROUTER_DIRECTIVES],
    template: `
        <div class="container">
            <form class="form-signin" (ngSubmit)="submitSignup()">
                <h2 class="form-signin-heading">Sign up</h2>
                <label for="inputUsername" class="sr-only">
                    Username
                </label>
                <input type="text"
                       class="form-control form-signin__first-input"
                       placeholder="Username"
                       required=""
                       autofocus=""
                       autocomplete="off"
                       [(ngModel)]="signupModel.username">
                <label for="inputEmail" class="sr-only">
                    Email address
                </label>
                <input type="email"
                       class="form-control form-signin__input"
                       placeholder="Email address"
                       required=""
                       autocomplete="off"
                       [(ngModel)]="signupModel.email">
                <label for="inputPassword" class="sr-only">
                    Password
                </label>
                <input type="password"
                       class="form-control form-signin__last-input"
                       placeholder="Password"
                       required=""
                       autocomplete="off"
                       [(ngModel)]="signupModel.password">
                <div class="checkbox">
                    <label>
                        <input type="checkbox"
                               value="remember-me"
                               [(ngModel)]="signupModel.remember"> Remember me
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
    private signupModel: Signup = null;

    constructor(
        private authorizationService: AuthorizationService,
        private router: Router
    ) {
        this.signupModel = new Signup({
            email: '',
            username: '',
            password: '',
            remember: false,
        });
    }

    submitSignup(): void {
        this.authorizationService.signup(this.signupModel)
            .then(() => {
                this.router.navigate(['ProjectManagement/TasksPage']);
            });
    }
}
