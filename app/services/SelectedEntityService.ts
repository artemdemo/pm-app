import {Subject} from 'rxjs';
import {Injectable} from '@angular/core';
import {TasksService, ITask} from './TasksService';
import {ProjectsService, IProject} from './ProjectsService';
import {BoardsService, IBoard} from './BoardsService';

export const enum EntityType {
    project,
    task,
    board
}

export interface ISelectedEntityService {
    setSelectedEntity(entityId: number, type: EntityType): void;
    dropSelectedEntity(type: EntityType): void;
    setNewEntity(type: EntityType): void;
    refreshEntity(type: EntityType): void;
    getEntitySubject(type: EntityType): Subject<any>;
}

@Injectable()
export class SelectedEntityService implements ISelectedEntityService {
    private project: Subject<IProject> = new Subject<IProject>();
    private task: Subject<ITask> = new Subject<ITask>();
    private board: Subject<IBoard> = new Subject<IBoard>();
    private entity: any;

    constructor(
        private projectsService: ProjectsService,
        private tasksService: TasksService,
        private boardsService: BoardsService
    ) { }

    setSelectedEntity(entityId: number, type: EntityType): void {
        let entities: any[] = [];
        switch (type) {
            case EntityType.project:
                entities = this.projectsService.getProjects();
                break;
            case EntityType.task:
                entities = this.tasksService.getTasks();
                break;
            case EntityType.board:
                entities = this.boardsService.getBoards();
                break;
            default:
                break;
        }
        for (let i: number = entities.length - 1; i > -1; i--) {
            if (entities[i].id === entityId) {
                this.entity = entities[i];
                this.refreshEntity(type);
                break;
            }
        }
    }

    getEntitySubject(type: EntityType): Subject<any> {
        let entity: any = null;
        switch (type) {
            case EntityType.project:
                entity = this.project;
                break;
            case EntityType.task:
                entity = this.task;
                break;
            case EntityType.board:
                entity = this.board;
                break;
            default:
                break;
        }
        return entity;
    }

    setNewEntity(type: EntityType): void {
        this.entity = null;
        switch (type) {
            case EntityType.project:
                this.entity = this.projectsService.getEmptyProject();
                break;
            case EntityType.task:
                this.entity = this.tasksService.getEmptyTask();
                break;
            case EntityType.board:
                this.entity = this.boardsService.getEmptyBoard();
                break;
            default:
                break;
        }
        if (this.entity) {
            this.refreshEntity(type);
        }
    }

    dropSelectedEntity(type: EntityType): void {
        this.entity = null;
        this.refreshEntity(type);
    }

    refreshEntity(type: EntityType): void {
        switch (type) {
            case EntityType.project:
                this.project.next(this.entity);
                break;
            case EntityType.task:
                this.task.next(this.entity);
                break;
            case EntityType.board:
                this.board.next(this.entity);
                break;
            default:
                break;
        }
    }
}
