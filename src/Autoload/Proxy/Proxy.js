;(function() {
    'use strict';

    function Proxy(opts) {
        var x = function() {
            return x.method.apply(this, arguments);
        };

        for (var key in opts) {
            if (opts.hasOwnProperty(key)) {
                x[key] = opts[key];
            }
        }

        x.method = x.method || function() {};

        return x;
    }

    this.Proxy = Proxy;
}).call(this);

module.exports = this.Proxy;