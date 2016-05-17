require('./Autoload/Autoloader.js')(__dirname);

global.app = {};
global.app.rootDir = require('path').resolve(__dirname);

var Container = use('Service.Container');
var Swig      = use('Swig');
var Promise   = use('Bluebird');

var lang;
var definitionsLang;

module.exports.crawl = function() {
    init()
        .then(
            function() {
                return getService('data_fetcher.index').fetch(lang);
            }
        )
        .map(
            function(prefix) {
                return getService('data_fetcher.terms').fetch(lang, prefix);
            }
        )
        .then(
            function(result) {
                console.log(result);
            }
        )
        .then(function() {
            return getService('data_fetcher.image').fetch('pl', 'smallhorse');
        })
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

    setSwigFilters();

    return new Promise(function(resolve) {
        resolve();
    });
}

function setSwigFilters() {
    //Swig.setFilter('str2doku', function(input) {
    //    return input.toLowerCase().replace(/ /g, '-');
    //});
    //Swig.setFilter('wrap_entities', function(input) {
    //    return input.replace(/(&.+?;)/g, '<html>$1</html>');
    //});
    //Swig.setFilter('concat', function(input, string) {
    //    return '' + input + string;
    //});
}