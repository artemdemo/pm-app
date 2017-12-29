// https://github.com/artemdemo/url-parser

// ToDo: Can't we use some npm package

export default (() => {
    /**
     * Main object of the plugin
     */
    const UrlParser = {};

    /**
     * Return value of given key<br>
     * Will return string if value for given key exists, null key has no value, undefined if there is no such key
     *
     * @param key {String}
     * @return {String || null || undefined}
     */
    UrlParser.getParam = function(key) {
        const allObject = this.getAll();
        if (allObject.hasOwnProperty(key) === false) return undefined;
        return allObject[key];
    };

    /**
     * Return object with all GET data from the URL
     * @return {Object}
     */
    UrlParser.getAll = function() {
        const urlParams = {};
        let match;
        let _param;
        const pl = /\+/g;  // Regex for replacing addition symbol with a space
        const search = /([^&=]+)=?([^&]*)/g;
        const decode = function(s) { return decodeURIComponent(s.replace(pl, ' ')); };
        let query = window.location.href;
        const qMarkIndex = query.indexOf('?');
        let hashIndex = query.indexOf('#/');

        hashIndex = hashIndex === -1 ? 0 : hashIndex;

        // It can be 2 different cases:
        // 1) http://someurl.com/app/?param1=somedata#/pagename
        // 2) http://someurl.com/app/#/pagename?param1=somedata
        // In both ways it should work properly
        // Therefore I'm cutting only relevant part from the URL - part between # and ?
        switch (true) {
            case qMarkIndex > hashIndex:
                query = query.substr(qMarkIndex + 1);
                break;
            case qMarkIndex < hashIndex:
                query = query.substr(qMarkIndex + 1, hashIndex - qMarkIndex - 1);
                break;
        }

        // eslint-disable-next-line
        while (match = search.exec(query)) {
            _param = decode(match[2]);
            urlParams[decode(match[1])] = _param === '' ? null : _param;
        }

        return urlParams;
    };

    /**
     * Check if given key exists in URL
     *
     * @param key {String}
     * @return {Boolean}
     */
    UrlParser.checkIfExist = function(key) {
        const allObject = this.getAll();
        return allObject.hasOwnProperty(key);
    };

    return UrlParser;
})();
