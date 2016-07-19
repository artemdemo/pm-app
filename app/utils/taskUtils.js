/**
 * Get array of selected projects for the given task.
 * (Task object has array of id's of selected projects)
 */
export function getSelectedProjects(task = {}, allProjects = []) {
    const selectedProjects = [];
    const selectedProjectsId = [];

    allProjects.forEach((project) => {
        if (task && task.projects.indexOf(project.id) > -1 && selectedProjectsId.indexOf(project.id) === -1) {
            selectedProjects.push(project);
            selectedProjectsId.push(project.id);
        }
    });

    return selectedProjects;
}
