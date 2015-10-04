/**
 * General interfaces that will be used across the application.
 * It is still possible to declare interfaces inside of modules, in case this interface will be used only there.
 */

/**
 * Inerface for the single task
 */
interface Task {
    name: string;
    created_at: {
        date: string;
        time: string;
        raw: moment.Moment;
    };
    sp: number;
    description: string;
}