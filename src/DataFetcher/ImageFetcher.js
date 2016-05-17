;(function() {
    'use strict';

    var GoogleImages = use('google-images')(getParameter('google.custom_search.images.cse_id'), getParameter('google.custom_search.images.api_key'));

    /**
     * @constructor
     * @param {HttpDownloaderFile} fileDownloader
     */
    function ImageFetcher(fileDownloader) {
        /**
         * @private
         * @member {HttpDownloaderFile} fileDownloader
         */
        Object.defineProperty(this, 'fileDownloader', {
            value: fileDownloader
        });
    }

    /**
     * @public
     * @param {string} lang
     * @param {string} word
     * @returns {Promise}
     */
    ImageFetcher.prototype.fetch = function(lang, word) {
        var scope = this;
        return GoogleImages
            .search(word)
            .then(function(images) {
                var url = images[0].url;
                return scope.fileDownloader.download(url, buildFileName(word, url), lang);
            });
    };

    function buildFileName(searchWord, url) {
        return searchWord + getExtensionFromUrl(url);
    }

    function getExtensionFromUrl(url) {
        return url.substring(url.lastIndexOf('.'));
    }

    this.ImageFetcher = ImageFetcher;
}).call(this);

module.exports = this.ImageFetcher;