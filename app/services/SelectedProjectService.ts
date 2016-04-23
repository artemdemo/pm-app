import {Subject} from 'rxjs';
import {Injectable, Inject} from 'angular2/core';
import {ProjectsService, IProjectsService, IProject} from './ProjectsService';

export interface ISelectedProjectService {
    project: Subject<IProject>;
    setSelectedProject(newProject: IProject): void;
    dropSelectedProject(): void;
    setNewProject(): void;
    refreshProject(): void;
}

@Injectable()
export class SelectedProjectService implements ISelectedProjectService {
    public project: Subject<IProject> = new Subject<IProject>();
    private _project: IProject = null;

    constructor(@Inject(ProjectsService) private ProjectsService: IProjectsService) {}

    setSelectedProject(newProject: IProject): void {
        this._project = newProject;
        this.refreshProject();
    }

    setNewProject(): void {
        this._project = this.ProjectsService.getEmptyProject();
        this.refreshProject();
    }

    dropSelectedProject(): void {
        this._project = null;
        this.refreshProject();
    }

    refreshProject(): void {
        this.project.next(this._project);
    }
}
