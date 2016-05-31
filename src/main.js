require('./Autoload/Autoloader.js')(__dirname);

global.app = {};
global.app.rootDir = require('path').resolve(__dirname);

var Container = use('Service.Container');
var Promise   = use('Bluebird');

var lang;
var definitionsLang;

module.exports.crawl = function() {
    init()
        .then(function() {
            var terms = [];

            if (typeof global.app.params.terms !== 'undefined') {
                terms = global.app.params.terms.split(',');

                for (var i in terms) {
                    terms[i] = terms[i].trim();
                }
            }

            return terms;
        })
        .then(
            function(data) {
                var fetcher = getService('data_fetcher.definition');
                var promises = [];

                for (var i in data) {
                        var term = data[i];
                        promises.push(fetcher.fetch(definitionsLang, term));
                }

                return Promise.all(promises)
            }
        )
        .then(
            function(data) {
                var fetcher = getService('data_fetcher.image');
                var promises = [];

                for (var i in data) {
                    var wordData = data[i];
                    promises.push(fetcher.fetch(definitionsLang, wordData));
                }

                return Promise.all(promises)
            }
        )
        .then(
            function(data) {
                var anki = getService('genanki.anki_generator');

                return anki
                    .open()
                    .then(
                        function(anki) {
                            var promises = [];

                            for (var i in data) {
                                var wordData = data[i];

                                promises.push(
                                    anki.write(wordData.term, wordData.definition, wordData.image)
                                );
                            }

                            return Promise
                                .all(promises)
                                .then(
                                    function() {
                                        return anki;
                                    }
                                );
                        }
                    )
                    .then(
                        function(anki) {
                            return anki.close();
                        }
                    )
                ;
            }
        )
        .then(
            function() {
                console.log('Runtime success.');
            },
            function(err) {
                console.log('Runtime error.');
                console.log(err);
            }
        )
    ;
};

function init() {
    global.app.container = new Service.Container();
    getService('config.loader.parameters').load();

    lang            = getParameter('lang');
    definitionsLang = getParameter('definitionsLang');

    return new Promise(function(resolve) {
        resolve();
    });
}