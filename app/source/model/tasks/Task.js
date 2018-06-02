import _omit from 'lodash/omit';

class Task {
    constructor(taskProps) {
        const {
            name,
            description = '',
            done = false,
            id,
            board_id = null,
            id_position_scrum = null,
            projects = [],
        } = taskProps;

        if (name == null || name === '') {
            throw new Error('"name" is required for Task creation');
        }
        this.name = name;
        this.description = description;
        this.done = done;
        if (id) {
            this.id = id;
        }
        this.board_id = board_id;
        this.id_position_scrum = id_position_scrum;
        this.projects = projects;

        // Future proof props copying
        // In case they've been added, but I haven't mentioned them here
        const restTask = _omit(taskProps, Object.keys(this));
        for (const key in restTask) {
            this[key] = restTask[key];
        }
    }
}

export default Task;
