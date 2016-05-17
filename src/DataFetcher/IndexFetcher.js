;(function() {
    'use strict';

    var DataFetcher = use('DataFetcher.Abstraction.DataFetcher');
    var Util        = use('Util');

    /**
     * @constructor
     * @param {HttpClient} httpClient
     * @param {Router} router
     */
    function IndexFetcher(httpClient, router) {

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
    IndexFetcher.prototype.fetch = function(lang) {
        var url = this.router.url('%dictionary.host%', 'dictionary.index', {
            lang: lang
        });
        return DataFetcher.prototype.fetch.call(this, url, 'abc');
    };

    /**
     * @protected
     * @param {Cheerio} $
     * @param (string} url
     * @returns {object}
     */
    IndexFetcher.prototype.extractData = function($, url) {
        var tag = url.split('/').pop();
        var reg = new RegExp('^\/wiki\/' + tag + '\/([a-zA-Z0-9]*?)$', 'i');
        var rep = new RegExp(tag + '\/', 'i');

        return $('a')
            .filter(
                function() {
                    return this.attribs.href !== undefined && this.attribs.href.match(reg);
                }
            )
            .map(
                function(i, letter) {
                    return letter.attribs.title.replace(rep, '');
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

    Util.inherits(IndexFetcher, DataFetcher);

    this.IndexFetcher = IndexFetcher;
}).call(this);

module.exports = this.IndexFetcher;