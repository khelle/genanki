;(function() {
    "use strict";

    use('Fs');
    use('util');

    const SERVICES_PATH = global.app.rootDir + '/../config/services.json';

    /**
     * @constructor
     */
    function Container() {

        /**
         * @private
         * @member {object} serviceDefinitions
         */
        Object.defineProperty(this, 'serviceDefinitions', {
            value: JSON.parse(Fs.readFileSync(SERVICES_PATH, 'utf8'))
        });

        /**
         * @private
         * @member {object} services
         */
        Object.defineProperty(this, 'services', {
            value: {}
        });

        for (var serviceName in this.serviceDefinitions) {
            resolveDefinition(this.serviceDefinitions[serviceName]);
        }

        global.getService = (function(scope) {
            return function(serviceName) {
                return scope.get(serviceName);
            };
        })(this);
    }

    /**
     * @public
     * @param {string} serviceName
     * @returns {object}
     */
    Container.prototype.get = function(serviceName) {
        guardAgainstUndefinedService.call(this, serviceName);

        var definition = getServiceDefinition.call(this, serviceName);

        if (definition.shared) {
            var service = getCachedService.call(this, definition.class);

            if (!service) {
                service = createService.call(this, definition);
                cacheService.call(this, definition.class, service);
            }

            return service;
        }

        return createService.call(this, definition);
    };

    /**
     * @private
     * @param {string} serviceName
     */
    function guardAgainstUndefinedService(serviceName) {
        if (!getServiceDefinition.call(this, serviceName)) {
            throw util.format('Service "%s" is not defined.', serviceName);
        }
    }

    /**
     * @private
     * @param {string} serviceName
     * @returns {object}
     */
    function getServiceDefinition(serviceName) {
        return this.serviceDefinitions[serviceName];
    }

    /**
     * @private
     * @param {string} serviceClass
     * @returns {object}
     */
    function getCachedService(serviceClass) {
        return this.services[serviceClass]
            ? this.services[serviceClass]
            : null;
    }

    /**
     * @private
     * @param {string} serviceClass
     * @param {object} service
     */
    function cacheService(serviceClass, service) {
        this.services[serviceClass] = service;
    }

    /**
     * @private
     * @param {object} definition
     * @returns {object}
     */
    function createService(definition) {
        var ServiceClass = definition.module
            ? use(definition.class)
            : definition.class;

        if (!isConstructable.call(this, ServiceClass)) {
            return ServiceClass;
        }

        function Service(args) {
            return ServiceClass.apply(this, args);
        }

        Service.prototype = ServiceClass.prototype;

        return new Service(parseArguments.call(this, definition.arguments));
    }

    /**
     * @private
     * @param {object} definition
     */
    function resolveDefinition(definition) {
        if (typeof definition.module === 'undefined') {
            definition.module = true;
        }
        if (typeof definition.shared === 'undefined') {
            definition.shared = true;
        }
        if (typeof definition.arguments == 'undefined') {
            definition.arguments = [];
        }
    }

    /**
     * @private
     * @param {object[]} args
     * @returns {object[]}
     */
    function parseArguments(args) {
        var scope = this;
        var parsedArgs = [];

        args.forEach(function(argument) {
            if (argument.startsWith('@')) {
                parsedArgs.push(scope.get(argument.substr(1)));
            } else {
                parsedArgs.push(argument);
            }

        });

        return parsedArgs;
    }

    /**
     * @private
     * @param {object} Service
     * @returns {boolean}
     */
    function isConstructable(Service) {
        return typeof Service.apply !== 'undefined';
    }

    this.Container = Container;
}).call(this);

module.exports = this.Container;