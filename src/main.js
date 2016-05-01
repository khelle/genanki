require('./Autoload/Autoloader.js')(__dirname);

global.app = {};
global.app.rootDir = require('path').resolve(__dirname);

var Container = use('Service.Container');
var Swig      = use('Swig');
var Promise   = use('Bluebird');

module.exports.crawl = function() {
    init()
        .then(
            function(result) {
                console.log('Runtime success.');
            },
            function(err) {
                console.log('Runtime error.');
            }
        )
    ;
};

function init() {
    global.app.container = new Service.Container();
    getService('config.loader.parameters').load();

    setSwigFilters();

    return new Promise(function(resolve) {
        resolve();
    });
}

function setSwigFilters() {
    //swig.setFilter('str2doku', function(input) {
    //    return input.toLowerCase().replace(/ /g, '-');
    //});
    //swig.setFilter('wrap_entities', function(input) {
    //    return input.replace(/(&.+?;)/g, '<html>$1</html>');
    //});
    //swig.setFilter('concat', function(input, string) {
    //    return '' + input + string;
    //});
}