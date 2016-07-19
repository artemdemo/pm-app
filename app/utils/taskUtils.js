/**
 * Return object that contain selected projects and available projects
 * (Task object has array of id's of selected projects)
 */
export function filterProjects(task, allProjects = []) {
    const availableProjects = [];
    const selectedProjects = [];

    allProjects.forEach((project) => {
        if (task && task.projects) {
            if (task.projects.indexOf(project.id) > -1) {
                selectedProjects.push(project);
            } else {
                availableProjects.push(project);
            }
        }
    });

    return { selectedProjects, availableProjects };
}
