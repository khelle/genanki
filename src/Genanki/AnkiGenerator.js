;(function() {
    "use strict";

    var Fs      = use('Fs');
    var Promise = use('Bluebird');
    var Util    = use('Util');

    /**
     * @constructor
     */
    function AnkiGenerator(path) {

        /**
         * @private
         * @member {string} path
         */
        Object.defineProperty(this, 'path', {
            value: getParameter('anki.collection.data')
        });

        /**
         * @private
         * @member {Router} router
         */
        Object.defineProperty(this, 'stream', {
            value: null,
            writable: true
        });
    }

    /**
     * @public
     * @returns {Promise}
     */
    AnkiGenerator.prototype.open = function() {
        var self = this;

        return new Promise(function(resolve) {
            self.stream = Fs.createWriteStream(self.path, {flags: 'w'});
            resolve(self);
        })
    };

    /**
     * @public
     * @returns {Promise}
     */
    AnkiGenerator.prototype.close = function() {
        var self = this;

        return new Promise(function(resolve) {
            if (self.stream !== null) {
                self.stream.end(function () {
                    self.stream = null;
                    resolve(self);
                });
            }
        });
    };

    /**
     * @protected
     * @returns {string}
     */
    AnkiGenerator.prototype.write = function(term, definition, image) {
        var self = this;
        var str = term + '\t' + definition + '\t<img src="' + image + '">\n';

        return new Promise(function(resolve, reject) {
            var status = self.stream.write(str, function() {
                resolve(self);
            });

            if (!status) {
                reject('Cannot write to file.');
            }
        });
    };

    this.AnkiGenerator = AnkiGenerator;
}).call(this);

module.exports = this.AnkiGenerator;