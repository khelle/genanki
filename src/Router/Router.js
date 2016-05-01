;(function() {
    "use strict";

    use('util');

    const ROUTES_PATH = global.app.rootDir + '/../config/routes.json';

    /**
     * @constructor
     * @param {JsonLoader} jsonLoader
     */
    function Router(jsonLoader) {
        Object.defineProperty(this, 'routes', {value: jsonLoader.load(ROUTES_PATH)});
    }

    /**
     * @public
     * @param {string} routeName
     * @param {string[]} params
     * @returns {string}
     */
    Router.prototype.path = function(routeName, params) {
        guardAgainstUndefinedRoute.call(this, routeName);

        if (typeof params === 'undefined') {
            params = {};
        }

        var path = getPath.call(this, routeName).slice(0);

        for (var key in params) {
            path = path.replace('{' + key + '}', params[key]);
        }

        return path;
    };

    /**
     * @public
     * @param {string} host
     * @param {string} routeName
     * @param {string[]} params
     * @returns {string}
     */
    Router.prototype.url = function(host, routeName, params) {
        return resolveHost(host) + this.path(routeName, params);
    };

    /**
     * @private
     * @param {string} routeName
     */
    function guardAgainstUndefinedRoute(routeName) {
        if (!getPath.call(this, routeName)) {
            throw util.format('Route "%s" is not defined.', routeName);
        }
    }

    /**
     * @private
     * @param {string} routeName
     * @returns {string}
     */
    function getPath(routeName) {
        return this.routes[routeName];
    }

    /**
     * @private
     * @param {string} host
     * @returns {string}
     */
    function resolveHost(host) {
        if (host.startsWith('%') && host.endsWith('%')) {
            return getParameter(host.slice(1, -1));
        }

        return host;
    }

    this.Router = Router;
}).call(this);

module.exports = this.Router;
