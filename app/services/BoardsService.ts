import {Http, Headers} from '@angular/http';
import {Subject} from 'rxjs';
import {Injectable} from '@angular/core';
import {AuthorizationService} from './AuthorizationService';

export interface IBoard {
    id: number;
    title: string;
    description: string;
    added: string;
    updated: string;
}

export interface IBoardService {
    loadBoards(): Promise<{}>;
    getBoards(): IBoard[];
}

@Injectable()
export class BoardService implements IBoardService {
    public boards: Subject<IBoard[]> = new Subject<IBoard[]>();
    private _boards: IBoard[] = [];
    private boardsLoading: boolean = false;

    constructor(
        private http: Http,
        private authorizationService: AuthorizationService
    ) {
        this.loadBoards();
    }

    loadBoards(): Promise<{}> {
        let headers: Headers = new Headers();
        headers.append('authorization', this.authorizationService.getToken());

        return new Promise((resolve, reject) => {
            if (this.boardsLoading) {
                resolve();
                return;
            }
            this.boardsLoading = true;
            this.http.get('/boards/all', {
                headers: headers,
            })
                .subscribe((res) => {
                    this._boards = res.json();
                    this.refreshBoards();
                    resolve();
                    this.boardsLoading = false;
                }, (error) => {
                    if (error.status === 401) {
                        this.authorizationService.unauthorizedError();
                    }
                    this.boardsLoading = false;
                });
        });
    }

    addBoard(task: IBoard): Promise<{}> {
        let headers: Headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('authorization', this.authorizationService.getToken());

        return new Promise((resolve, reject) => {
            this.http.post('/boards', JSON.stringify(task), {
                headers: headers,
            }).subscribe((res) => {
                this._boards.push(Object.assign(task, res.json()));
                this.refreshBoards();
                resolve();
            }, () => {
                reject();
            });
        });
    }

    updateBoard(task: IBoard): Promise<{}> {
        let headers: Headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('authorization', this.authorizationService.getToken());

        return new Promise((resolve, reject) => {
            this.http.put('/boards', JSON.stringify(task), {
                headers: headers,
            }).subscribe((res) => {
                let updated: boolean = false;
                for (let i: number = 0, len: number = this._boards.length; i < len; i++) {
                    if (this._boards[i].id === task.id) {
                        this._boards[i] = task;
                        this.refreshBoards();
                        updated = true;
                        resolve();
                        break;
                    }
                }
                if (!updated) {
                    reject();
                }
            }, () => {
                reject();
            });
        });
    }

    deleteBoard(boardId: number): Promise<{}> {
        let headers: Headers = new Headers();
        headers.append('authorization', this.authorizationService.getToken());

        return new Promise((resolve, reject) => {
            this.http.delete(`/boards/${boardId}`, {
                headers: headers,
            }).subscribe((res) => {
                let deleted: boolean = false;
                for (let i: number = this._boards.length - 1; i >= 0; i--) {
                    if (this._boards[i].id === boardId) {
                        this._boards.splice(i, 1);
                        this.refreshBoards();
                        resolve();
                        deleted = true;
                        break;
                    }
                }
                if (!deleted) {
                    reject();
                }
            }, () => {
                reject();
            });
        });
    }

    getEmptyBoard(): IBoard {
        return {
            id: null,
            title: '',
            description: '',
            added: null,
            updated: null,
        };
    }

    refreshBoards(): void {
        this.boards.next(this._boards)
    }

    getBoards: any = (): IBoard[] => this._boards;
}
