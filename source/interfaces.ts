/**
 * General interfaces that will be used across the application.
 * It is still possible to declare interfaces inside of modules, in case this interface will be used only there.
 */


/**
 * General response from the server on save/delete/put an piece of data
 * It could be for project or task or whatever was saved
 */
interface gIOresponce {
    ErrorStatus: number;
    id?: string;
}