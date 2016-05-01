;(function() {
    "use strict";

    var swig = use('swig');

    const TEMPLATES_DIR = global.app.rootDir + '/../src/Templates';

    /**
     * @constructor
     */
    function ContentGenerator() {}

    /**
     * @public
     * @param {string[]} options
     */
    ContentGenerator.prototype.generate = function(options) {
        return this.generateTemplate(
            this.findTemplate(this.getDefaultTemplateName()),
            options
        );
    };

    /**
     * @public
     * @param {string} template
     * @param {string[]} options
     * @returns {string}
     */
    ContentGenerator.prototype.generateTemplate = function(template, options) {
        return swig.renderFile(template, options);
    };

    /**
     * @public
     * @param {string} template
     * @returns {string}
     */
    ContentGenerator.prototype.findTemplate = function(template) {
        return TEMPLATES_DIR + '/' + template;
    };

    /**
     * @public
     * @returns {string}
     */
    ContentGenerator.prototype.getDefaultTemplateName = function() {
        throw 'This function must be overriden!';
    };

    this.ContentGenerator = ContentGenerator;
}).call(this);

module.exports = this.ContentGenerator;
