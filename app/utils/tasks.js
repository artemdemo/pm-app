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
 *
 * @param holder {Object} - has `tasks` property
 * @param allTasks {Array}
 */
export function filterTasks(holder, allTasks = []) {
    const selectedTasks = [];
    let availableTasks = [];

    if (holder && holder.tasks) {
        allTasks.forEach((task) => {
            if (holder.tasks.indexOf(task.id) > -1) {
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

/**
 * Callback function for `sort()` array method.
 * Sorting tasks by `id_position_scrum`
 * @param taskA
 * @param taskB
 * @returns {number}
 */
export function sortByIdPositionScrum(taskA, taskB) {
    if (taskA.id_position_scrum < taskB.id_position_scrum) {
        return -1;
    }
    if (taskA.id_position_scrum > taskB.id_position_scrum) {
        return 1;
    }
    return 0;
}
