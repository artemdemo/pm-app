export default function checkResponseStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }

    let error = new Error(response.statusText);
    error.response = response;
    throw error;
}
