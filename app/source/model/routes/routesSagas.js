import routes from '../../routes/routes';

/**
 * Async routing request.
 * Can be stored in the server and then return with pages based on user permissions.
 * @return {Promise<any>}
 */
export const requestRoutes = () => {
    return Promise.resolve(
        routes
    );
};
