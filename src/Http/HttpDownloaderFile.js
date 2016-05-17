;(function() {
    'use strict';

    var Fs       = use('Fs');
    var Util     = use('Util');
    var Promise  = use('Bluebird');

    function HttpDownloaderFile(httpClient) {
        /**
         * @private
         * @member {httpClient} client
         */
        Object.defineProperty(this, 'client', {
            value: httpClient
        });

        /**
         * @private
         * @member {string} mediaDir
         */
        Object.defineProperty(this, 'collectionMediaDir', {
            value: getParameter('anki.collection.media')
        });
    }

    HttpDownloaderFile.prototype.download = function (url, filename, prefix) {
        var scope = this;

        return this.client.get(url, {'encoding': 'binary'})
            .then(function(response) {
                if (typeof prefix === 'undefined') {
                    prefix = '';
                } else {
                    prefix = prefix + '_'
                }

                var fullName =  prefix.toLowerCase() + filename.toLowerCase();
                var path = Util.format('%s/%s', scope.collectionMediaDir, fullName);

                return new Promise(function(resolve) {
                    Fs.writeFile(path, response.body, 'binary');
                    resolve({
                        path: path,
                        name: fullName
                    });
                });
            });
    };

    this.HttpDownloaderFile = HttpDownloaderFile;
}).call(this);

module.exports = this.HttpDownloaderFile;