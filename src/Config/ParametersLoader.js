;(function() {
    "use strict";

    const PARAMETERS_PATH = global.app.rootDir + '/../config/params.json';

    /**
     * @constructor
     * @param {JsonLoader} jsonLoader
     */
    function ParametersLoader(jsonLoader) {

        /**
         * @private
         * @member {JsonLoader} jsonLoader
         */
        Object.defineProperty(this, 'jsonLoader', {
            value: jsonLoader
        });

        global.getParameter = (function(scope) {
            return function(param) {
                return global.app.params[param];
            };
        })(this);
    }

    /**
     * @public
     */
    ParametersLoader.prototype.load = function() {
        global.app.params = this.jsonLoader.load(PARAMETERS_PATH);

        process.argv.forEach(function (val) {
            if (val.indexOf('=') > -1) {
                var keyVal = val.replace(/-/g, '').split('=');
                global.app.params[keyVal[0]] = keyVal[1];
            }
        });
    };

    this.ParametersLoader = ParametersLoader;
}).call(this);

module.exports = this.ParametersLoader;