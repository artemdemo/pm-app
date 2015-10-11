/**
 * General interfaces that will be used across the application.
 * It is still possible to declare interfaces inside of modules, in case this interface will be used only there.
 */

/**
 * Interface for the single task
 */
interface Task {
    id;
    priority;
    sp;
    status;
    name: string;
    created_at: {
        date: string;
        time: string;
        raw: moment.Moment;
    };
    description: string;
}


/**
 * Interface for the single project
 */
interface Project {
    name: string;
    created_at: {
        date: string;
        time: string;
        raw: moment.Moment;
    };
    description: string;
}