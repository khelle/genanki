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
         * @member {Router} router
         */
        Object.defineProperty(this, 'router', {
            value: router
        });

        DataFetcher.call(this, httpClient);
    }

    /**
     * @public
     * @returns {Promise}
     */
    DefinitionsFetcher.prototype.fetch = function(lang, letter) {
        var url = this.router.url('%dictionary.host%', 'dictionary.lemmas', {
            lang: lang,
            letter: letter
        });
        return DataFetcher.prototype.fetch.call(this, url);
    };

    /**
     * @protected
     * @param {Cheerio} $
     * @returns {object}
     */
    DefinitionsFetcher.prototype.extractData = function($) {

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