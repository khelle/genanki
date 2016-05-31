;(function() {
    'use strict';

    var DataFetcher = use('DataFetcher.Abstraction.DataFetcher');
    var Util        = use('Util');

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

        return DataFetcher.prototype.fetch.call(this, url, word);
    };

    function getHost(lang) {
        return 'https://' + lang + '.wikipedia.org/';
    }

    /**
     * @protected
     * @param {Cheerio} $
     * @param {string} url
     * @param {string} word
     * @returns {object}
     */
    DefinitionFetcher.prototype.extractData = function($, url, word) {
        return {
            term: word,
            definition: $('#mw-content-text').children('p').first().text().replace(/\r?\n/g, '<br>')//.replace(/;/g, '&#59;')
        };
    };

    Util.inherits(DefinitionFetcher, DataFetcher);

    this.DefinitionFetcher = DefinitionFetcher;
}).call(this);

module.exports = this.DefinitionFetcher;