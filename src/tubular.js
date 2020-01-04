module.exports = function Tubular(connectorName, options) {
    var connectorInstance = require(`./connectors/${connectorName}`)(options);

    return {
        connector: connectorInstance,
        createGridResponse: function (request, subset) {    
            if (!request)
                throw '"request" cannot be null';

            if (!subset)
                throw '"subset" cannot be null';

            if (request.columns == null || request.columns.length == 0)
                throw 'No Columns specified on the request';

            return connectorInstance.createGridResponse(request, subset);
        }
    }
};