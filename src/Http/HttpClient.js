;(function() {
    'use strict';

    var Request = use('Request');
    var Promise = use('Bluebird');
    var Extend  = use('Extend');

    /**
     * @constructor
     */
    function HttpClient() {}

    /**
     * @public
     * @param {string} url
     * @param {string[]} data
     * @param {CookieJar} cookieJar
     * @returns {Promise}
     */
    HttpClient.prototype.get = function(url, data, cookieJar) {
        cookieJar = cookieJar || Request.jar();
        data = data || {};

        return new Promise(function(resolve, reject) {
            Request.get(
                Extend(
                    true,
                    {
                        url: url,
                        jar: cookieJar
                    },
                    data
                ),
                function (error, response) {
                    if (response === undefined) {
                        return reject('Received invalid HttpResponse from [' + url + ']');
                    }

                    response.jar = function() {
                        return cookieJar;
                    };

                    if (!error) {
                        return resolve(response);
                    }

                    return reject('Received error on [GET] ' + url);
                }
            );
        });
    };

    /**
     * @public
     * @param {string} url
     * @param {string[]} data
     * @param {CookieJar} cookieJar
     * @returns {Promise}
     */
    HttpClient.prototype.post = function(url, data, cookieJar) {
        cookieJar = cookieJar || Request.jar();
        data = data || {};

        return new Promise(function(resolve, reject) {
            Request.post(
                Extend(
                    true,
                    {
                        url: url,
                        jar: cookieJar
                    },
                    data
                ),
                function (error, response) {
                    if (response === undefined) {
                        return reject('Received invalid HttpResponse from [' + url + ']');
                    }

                    response.jar = function() {
                        return cookieJar;
                    };

                    if (!error) {
                        return resolve(response);
                    }

                    return reject('Received error on [POST] ' + data.url);
                }
            );
        });
    };

    this.HttpClient = HttpClient;
}).call(this);

module.exports = this.HttpClient;