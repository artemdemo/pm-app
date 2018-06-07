import _omit from 'lodash/omit';

class Project {
    constructor(projectProps) {
        const {
            name,
            description = '',
            id,
            tasks = [],
        } = projectProps;

        if (name == null || name === '') {
            throw new Error('"name" is required for Task creation');
        }
        this.name = name;
        this.description = description;
        if (id) {
            this.id = id;
        }
        this.tasks = tasks;

        // Future proof props copying
        // In case they've been added, but I haven't mentioned them here
        const restTask = _omit(projectProps, Object.keys(this));
        for (const key in restTask) {
            this[key] = restTask[key];
        }
    }
}

export default Project;
