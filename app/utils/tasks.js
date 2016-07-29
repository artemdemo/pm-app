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

/**
 * Return object that contain selected and available tasks
 * (Project object has array of id's of selected tasks)
 */
export function filterTasks(project, allTasks = []) {
    const selectedTasks = [];
    let availableTasks = [];

    if (project && project.tasks) {
        allTasks.forEach((task) => {
            if (project.tasks.indexOf(task.id) > -1) {
                selectedTasks.push(task);
            } else {
                availableTasks.push(task);
            }
        });
    } else {
        availableTasks = allTasks;
    }


    return { selectedTasks, availableTasks };
}
