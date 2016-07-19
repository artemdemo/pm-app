/**
 * Get array of selected projects for the given task.
 * (Task object has array of id's of selected projects)
 */
export function getSelectedProjects(task = {}, allProjects = []) {
    let selectedProjects = [];
    let selectedProjectsId = [];

    allProjects.forEach((project) => {
        if (task && task.projects.indexOf(project.id) > -1 && selectedProjectsId.indexOf(project.id) === -1) {
            selectedProjects.push(project);
            selectedProjectsId.push(project.id);
        }
    });

    return selectedProjects;
}
