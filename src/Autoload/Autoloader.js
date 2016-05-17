;(function() {
    'use strict';

    var Proxy = require('./Proxy/Proxy.js');

    /**
     * @constructor
     * @param {string} url
     */
    function Autoloader(url) {
        url = require('path').normalize(url);

        /**
         * @private
         * @param {string} url
         */
        Object.defineProperty(this, 'url', {
            value: url,
            writable: true
        });

        /**
         * @private
         * @param {object} classes
         */
        Object.defineProperty(this, 'classes', {
            value: {},
            writable: true
        });
    }

    /**
     * @public
     * @param {string} url
     */
    Autoloader.prototype.init = function(url) {
        global.use = (function(scope) {
            return function(className) {
                var classPath = className.replace(/\./g, '/').replace(/\.js$/, '');

                if (scope.classes.hasOwnProperty[classPath]) {
                    return scope.classes[classPath];
                }

                var classTree = className.split('.');
                var getter = null;
                var type = 1;

                try {
                    getter = require(classPath.toLowerCase());
                    type = 1;
                }
                catch (err) {
                    try {
                        getter = require(scope.url + '/' + classPath + '.js');
                        type = 2;
                    }
                    catch (err) {
                        throw new Error('Module ' + className + ' could not be autoloaded because of ' + err + '.');
                    }
                }

                var classNode = null;
                var classScope = global;

                for (var key=0; key<classTree.length; key++) {
                    classNode = classTree[key];

                    if (!classScope.hasOwnProperty(classNode)) {
                        if (key<classTree.length-1) {
                            classScope[classNode] = new Proxy({});
                        }
                        else {
                            if (type == 1) {
                                classScope[classNode] = getter;
                            }
                            else {
                                classScope[classNode] = new Proxy({});
                            }
                        }
                    }

                    if (type == 2 && key==classTree.length-1) {
                        classScope[classNode].method = (function(getter) {
                            function F(args) {
                                return getter.apply(this, args);
                            }
                            F.prototype = getter.prototype;

                            return function() {
                                return new F(arguments);
                            };
                        })(getter);
                    }

                    classScope = classScope[classNode];
                }

                scope.classes[classPath] = getter;

                return getter;
            }
        })(this);
    };

    this.Autoloader = Autoloader;
}).call(this);

module.exports = (function(scope) {
    return function(url) {
        return (new scope.Autoloader(url)).init();
    };
})(this);