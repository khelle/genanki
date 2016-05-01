;(function() {
    "use strict";

    var Promise = use('Bluebird');
    var Fs      = use('Fs');
    var Tmp     = use('Tmp');

    /**
     * @constructor
     * @param {HttpClient} httpClient
     */
    function DownloadManager(httpClient) {

        /**
         * @private
         * @member {HttpClient} httpClient
         */
        Object.defineProperty(this, 'httpClient', {
            value: httpClient
        });

        /**
         * @private
         * @member {object} filenameMap
         */
        Object.defineProperty(this, 'filenameMap', {
            value: {}
        });
    }

    /**
     * @public
     * @param {string} url
     * @returns {Promise}
     */
    DownloadManager.prototype.downloadText = function(url) {
        return this.download(url, null);
    };

    /**
     * @public
     * @param {string} url
     * @returns {Promise}
     */
    DownloadManager.prototype.downloadBinary = function(url) {
        return this.download(url, 'binary');
    };

    /**
     * @public
     * @param {string} url
     * @param {string} encoding
     * @returns {Promise}
     */
    DownloadManager.prototype.download = function(url, encoding) {
        return this.httpClient.get(url, { encoding: encoding })
            .then((function(scope) {
                return function(response) {
                    var tmpFile = tmp.fileSync();

                    fs.writeFile(tmpFile.name, response.body, encoding);
                    scope.filenameMap[tmpFile.name] = parseFilename(url);

                    return fs.createReadStream(tmpFile.name);
                }
            })(this));
    };

    /**
     * @private
     * @param {string} url
     * @returns {string}
     */
    function parseFilename(url) {
        return url.slice(url.lastIndexOf('/')+1);
    }

    this.DownloadManager = DownloadManager;
}).call(this);

module.exports = this.DownloadManager;