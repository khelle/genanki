;(function() {
    'use strict';

    var DataFetcher = use('DataFetcher.Abstraction.DataFetcher');
    var Util        = use('Util');

    /**
     * @constructor
     * @param {HttpClient} httpClient
     * @param {Router} router
     */
    function DefinitionsFetcher(httpClient, router) {

        /**
         * @private
         * @member {string} url
         */
        Object.defineProperty(this, 'url', {
            value: router.url('%dictionary.host%', 'dictionary.lemmas')
        });
    }

    /**
     * @public
     * @returns {Promise}
     */
    CategoryListFetcher.prototype.fetch = function() {
        return DataFetcher.prototype.fetch.call(this, this.url);
    };

    /**
     * @protected
     * @param {Cheerio} $
     * @returns {object}
     */
    CategoryListFetcher.prototype.extractData = function($) {

        console.log($);
        //return $('h2.smaller').map(function(i, category) {
        //    var $category = $(category);
        //    var problems = $category.next('table').find('a').map(function(i, problem) {
        //        var $problem = $(problem);
        //
        //        return $problem.text().trim();
        //    }).toArray();
        //
        //    return {
        //        name: $category.text(),
        //        problems: problems
        //    }
        //}).toArray();
    };

    Util.inherits(DefinitionsFetcher, DataFetcher);

    this.DefinitionsFetcher = DefinitionsFetcher;
}).call(this);

module.exports = this.DefinitionsFetcher;