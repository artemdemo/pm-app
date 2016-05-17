import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router-deprecated';
import {AuthorizationService, Login} from '../services/AuthorizationService';

@Component({
    selector: 'login-page',
    directives: [ROUTER_DIRECTIVES],
    template: `
        <div class="container">
            <form class="form-signin" (ngSubmit)="submitLogin()">
                <h2 class="form-signin-heading">Please sign in</h2>
                <label for="inputEmail" class="sr-only">
                    Email address
                </label>
                <input type="email"
                       class="form-control form-signin__first-input"
                       placeholder="Email address"
                       required=""
                       autofocus=""
                       autocomplete="off"
                       [(ngModel)]="loginModel.email">
                <label for="inputPassword" class="sr-only">
                    Password
                </label>
                <input type="password"
                       class="form-control form-signin__last-input"
                       placeholder="Password"
                       required=""
                       autocomplete="off"
                       [(ngModel)]="loginModel.password">
                <div class="checkbox">
                    <label>
                        <input type="checkbox"
                               value="remember-me"
                               [(ngModel)]="loginModel.remember"> Remember me
                    </label>
                </div>
                <button class="btn btn-lg btn-primary btn-block"
                        type="submit">
                    Login
                </button>
                <a class="btn btn-link btn-block"
                   [routerLink]="['SignupPage']">
                    Create new account - sign up
                </a>
            </form>
        </div>
    `,
})
export class LoginPage {
    private loginModel: Login = null;

    constructor(
        private authorizationService: AuthorizationService,
        private router: Router
    ) {
        this.loginModel = new Login({
            email: '',
            password: '',
            remember: false,
        });
    }

    submitLogin(): void {
        this.authorizationService.login(this.loginModel)
            .then(() => {
                this.router.navigate(['ProjectManagement/TasksPage']);
            });
    }
}
