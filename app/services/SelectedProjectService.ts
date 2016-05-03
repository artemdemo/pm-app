import {Subject} from 'rxjs';
import {Injectable, Inject} from '@angular/core';
import {ProjectsService, IProjectsService, IProject} from './ProjectsService';

export interface ISelectedProjectService {
    project: Subject<IProject>;
    setSelectedProject(projectId: number): void;
    dropSelectedProject(): void;
    setNewProject(): void;
    refreshProject(): void;
}

@Injectable()
export class SelectedProjectService implements ISelectedProjectService {
    public project: Subject<IProject> = new Subject<IProject>();
    private _project: IProject = null;

    constructor(@Inject(ProjectsService) private ProjectsService: IProjectsService) {}

    setSelectedProject(projectId: number): void {
        const projects: IProject[] = this.ProjectsService.getProjects();
        for (let i: number = projects.length - 1; i > -1; i--) {
            if (projects[i].id === projectId) {
                this._project = projects[i];
                this.refreshProject();
                break;
            }
        }
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
