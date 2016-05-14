import {Http, Headers} from '@angular/http';
import {Injectable} from '@angular/core';

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

    setToken(newToken: string): void {
        this.token = newToken;
    }

    getToken: any = (): string => this.token;
}
