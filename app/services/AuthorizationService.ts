import {Http, Headers} from '@angular/http';
import {Router, ComponentInstruction} from '@angular/router-deprecated';
import {Injectable, Injector} from '@angular/core';
import {appInjector} from './appInjector';
import moment = require('moment');
import Moment = moment.Moment;

export interface IUser {
    email: string;
    password?: string;
    remember?: boolean;
}

// Model for form
export class Login {
    public email: string;
    public password: string;
    public remember: boolean;

    constructor(newUser: IUser) {
        this.email = newUser.email;
        this.password = newUser.password;
        this.remember = newUser.remember;
    }
}

export interface IToken {
    id: string;
    expiration: string;
}

export interface IAuthorizationService {
    login(user: IUser): Promise<{}>;
    setToken(newToken: string): void;
    getToken(): string;
    isLoggedIn(): boolean;
    unauthorizedError(): void;
}

@Injectable()
export class AuthorizationService implements IAuthorizationService {
    private token: string;

    constructor(
        private http: Http,
        private router: Router
    ) {
        this.token = window.localStorage.getItem('pm-token');
    }

    login(user: IUser): Promise<{}> {
        let headers: Headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return new Promise((resolve, reject) => {
            this.http.put('/login', JSON.stringify(user), {
                headers: headers,
            }).subscribe((res) => {
                this.setToken(res.headers.get('authorization'), user.remember);
                resolve();
            }, () => {
                reject();
            });
        });
    }

    logout(): Promise<{}> {
        let headers: Headers = new Headers();
        headers.append('authorization', this.getToken());

        return new Promise((resolve, reject) => {
            this.http.get('/logout', {
                headers: headers,
            }).subscribe((res) => {
                this.token = null;
                window.localStorage.removeItem('pm-token');
                this.router.navigate(['LoginPage']);
                resolve();
            }, () => {
                reject();
            });
        });
    }

    isLoggedIn(): boolean {
        const tokenSections: string[] = this.token ? this.token.split('.') : null;
        const now: Moment = moment(new Date());
        let tokenData: IToken;
        if (tokenSections) {
            try {
                tokenData = JSON.parse(atob(tokenSections[1]));
            } catch (e) {
                return false;
            }
            return now.format('YYYY-MM-DD') < tokenData.expiration;
        } else {
            return false;
        }
    };

    setToken(newToken: string, remember: boolean = false): void {
        this.token = newToken;
        if (remember) {
            window.localStorage.setItem('pm-token', newToken);
        }
    }

    unauthorizedError(): void {
        this.router.navigate(['LoginPage']);
        window.localStorage.removeItem('pm-token');
    }

    getToken: any = (): string => this.token;
}

export const isLoggedIn: any = (next: ComponentInstruction, previous: ComponentInstruction): Promise<boolean> => {
    let injector: Injector = appInjector();
    let authorizationService: AuthorizationService = injector.get(AuthorizationService);
    let router: Router = injector.get(Router);

    // You can return also boolean instead of Promise, but Promise is more flexible
    // in case you will need do some checkings
    return new Promise((resolve) => {
        if (authorizationService.isLoggedIn()) {
            resolve(true);
        } else {
            router.navigate(['LoginPage']);
            resolve(false);
        }
    });
};
