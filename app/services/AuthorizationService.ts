import {Http, Headers} from '@angular/http';
import {Router, ComponentInstruction} from '@angular/router-deprecated';
import {Injectable, Injector} from '@angular/core';
import {appInjector} from './appInjector';

export interface IUser {
    email: string;
    password?: string;
}

// Model for form
export class Login {
    public email: string;
    public password: string;

    constructor(newUser: IUser) {
        this.email = newUser.email;
        this.password = newUser.password;
    }
}

export interface IAuthorizationService {
    login(user: IUser): Promise<{}>;
    setToken(newToken: string): void;
    getToken(): string;
    isLoggedIn(): boolean;
}

@Injectable()
export class AuthorizationService implements IAuthorizationService {
    private token: string;

    constructor(
        private http: Http
    ) {}

    login(user: IUser): Promise<{}> {
        let headers: Headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return new Promise((resolve, reject) => {
            this.http.put('/login', JSON.stringify(user), {
                headers: headers,
            }).subscribe((res) => {
                this.setToken(res.headers.get('authorization'));
                resolve();
            }, () => {
                reject();
            });
        });
    }

    isLoggedIn(): boolean {
        const tokenSections: string[] = this.token ? this.token.split('.') : null;
        let tokenData: string;
        if (tokenSections) {
            tokenData = atob(tokenSections[1]); // session id & expiration YYYY-MM-DD
        }
        return !!this.token;
    };

    setToken(newToken: string): void {
        this.token = newToken;
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
