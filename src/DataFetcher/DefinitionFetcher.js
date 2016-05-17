;(function() {
    'use strict';

    var DataFetcher = use('DataFetcher.Abstraction.DataFetcher');
    var Util        = use('Util');
    var currentWord;

    /**
     * @constructor
     * @param {HttpClient} httpClient
     * @param {Router} router
     */
    function DefinitionFetcher(httpClient, router) {
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
    DefinitionFetcher.prototype.fetch = function(lang, word) {
        var url = this.router.url(getHost(lang), 'dictionary.definition', {word: word});

        currentWord = word;

        return DataFetcher.prototype.fetch.call(this, url);
    };

    function getHost(lang) {
        return 'https://' + lang + '.wiktionary.org/';
    }

    /**
     * @protected
     * @param {Cheerio} $
     * @returns {object}
     */
    DefinitionFetcher.prototype.extractData = function($) {
        return {
            term: currentWord,
            definition: $('#mw-content-text').wrap('<div></div>').parent().html()
        };
    };

    Util.inherits(DefinitionFetcher, DataFetcher);

    this.DefinitionFetcher = DefinitionFetcher;
}).call(this);

module.exports = this.DefinitionFetcher;