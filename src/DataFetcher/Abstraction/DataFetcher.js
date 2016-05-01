(function() {
    'use strict';

    var HttpClient  = use('Http.HttpClient');
    var cheerio     = use('Cheerio');

    /**
     * @constructor
     */
    function DataFetcher() {

        /**
         * @private
         * @member {HttpClient} httpClient
         */
        Object.defineProperty(this, 'httpClient', {
            value: new HttpClient()
        });
    }

    /**
     * @public
     * @param {string} url
     * @returns {Promise}
     */
    DataFetcher.prototype.fetch = function(url) {
        var promise = this.httpClient.get(url);

        return promise.then((function(context) {
            return function(result) {
                var $ = cheerio.load(result.body);
                return context.extractData($);
            };
        })(this));
    };

    /**
     * @protected
     * @param {Cheerio} $
     * @returns {object}
     */
    DataFetcher.prototype.extractData = function($) {
        throw 'You can\'t call this method!';
    };

    this.DataFetcher = DataFetcher;
}).call(this);

module.exports = this.DataFetcher;