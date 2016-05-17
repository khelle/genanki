;(function() {
    'use strict';

    var DataFetcher = use('DataFetcher.Abstraction.DataFetcher');
    var Util        = use('Util');

    /**
     * @constructor
     * @param {Router} router
     */
    function DefinitionFetcher(router) {
        /**
         * @private
         * @member {Router} router
         */
        Object.defineProperty(this, 'router', {
            value: router
        });

        DataFetcher.call(this);
    }

    /**
     * @public
     * @returns {Promise}
     */
    DefinitionFetcher.prototype.fetch = function(lang, word) {
        var url = this.router.url();
        return DataFetcher.prototype.fetch.call(this, this.url);
    };

    /**
     * @protected
     * @param {Cheerio} $
     * @returns {object}
     */
    DefinitionFetcher.prototype.extractData = function($) {
        return $('h2.smaller').map(function(i, category) {
            var $category = $(category);
            var problems = $category.next('table').find('a').map(function(i, problem) {
                var $problem = $(problem);

                return $problem.text().trim();
            }).toArray();

            return {
                name: $category.text(),
                problems: problems
            }
        }).toArray();
    };

    Util.inherits(DefinitionFetcher, DataFetcher);

    this.DefinitionFetcher = DefinitionFetcher;
}).call(this);

module.exports = this.DefinitionFetcher;