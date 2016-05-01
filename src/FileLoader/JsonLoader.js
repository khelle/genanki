;(function() {
    "use strict";

    use('Fs');

    const ENCODING_UTF8 = 'utf8';

    /**
     * @constructor
     */
    function JsonLoader() {}

    /**
     * @public
     * @param {string} fileName
     * @param {string} encoding
     * @return {object}
     */
    JsonLoader.prototype.load = function(fileName, encoding) {
        if (!encoding) {
            encoding = ENCODING_UTF8;
        }

        return JSON.parse(Fs.readFileSync(fileName, encoding));
    };

    this.JsonLoader = JsonLoader;
}).call(this);

module.exports = this.JsonLoader;
