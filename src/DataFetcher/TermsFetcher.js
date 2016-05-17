;(function() {
    'use strict';

    var DataFetcher = use('DataFetcher.Abstraction.DataFetcher');
    var Util        = use('Util');

    /**
     * @constructor
     * @param {HttpClient} httpClient
     * @param {Router} router
     */
    function TermsFetcher(httpClient, router) {

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
     * @param {string} lang
     * @param {string} prefix
     * @returns {Promise}
     */
    TermsFetcher.prototype.fetch = function(lang, prefix) {
        var url = this.router.url('%dictionary.host%', 'dictionary.terms', {
            lang: lang,
            prefix: prefix
        });
        return DataFetcher.prototype.fetch.call(this, url);
    };

    /**
     * @protected
     * @param {Cheerio} $
     * @param {string} url
     * @returns {object}
     */
    TermsFetcher.prototype.extractData = function($, url) {

        var reg = new RegExp('^\/wiki\/([a-zA-Z0-9]{4,})$', 'i');
        var termsCurrent = 0;
        var termsLimit = parseInt(getParameter('termsLimit'));

        return $('i')
            .filter(
                function() {
                    return $(this).text().trim() === 'n';
                }
            )
            .prev('a')
            .filter(
                function() {
                    return this.attribs.title !== undefined
                        && this.attribs.href !== undefined
                        && this.attribs.href.match(reg)
                    ;
                }
            )
            .filter(
                function() {
                    return termsCurrent++ < termsLimit;
                }
            )
            .map(
                function(i, noun) {
                    return noun.attribs.title;
                }
            )
            .toArray()
            .filter(
                function(value, index, self) {
                    return self.indexOf(value) === index;
                }
            )
        ;
    };

    Util.inherits(TermsFetcher, DataFetcher);

    this.TermsFetcher = TermsFetcher;
}).call(this);

module.exports = this.TermsFetcher;