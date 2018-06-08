import _omit from 'lodash/omit';

class Board {
    constructor(projectProps) {
        const {
            name,
            description = '',
            id,
        } = projectProps;

        if (name == null || name === '') {
            throw new Error('"name" is required for Board creation');
        }
        this.name = name;
        this.name = name;
        this.description = description;
        if (id) {
            this.id = id;
        }

        // Future proof props copying
        // In case they've been added, but I haven't mentioned them here
        const restTask = _omit(projectProps, Object.keys(this));
        for (const key in restTask) {
            this[key] = restTask[key];
        }
    }
}
