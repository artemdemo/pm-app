export default (function() {
    try {
        return window.location.origin || '';
    } catch (e) {
        // This will return domain in node.js environment
        return 'http://localhost:8000';
    }
})();
