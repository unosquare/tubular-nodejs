var GridDataRequest = require('./grid-data-request');

module.exports = function Tubular(connectorName, options) {
    var connectorInstance = require(`./connectors/${connectorName}`)(options);

    return {
        connector: connectorInstance,
        createGridResponse: function (request, subset) {
            if (!(request instanceof GridDataRequest))
                throw '"request" must be an instance of GridDataRequest';

            if (!subset)
                throw '"subset" cannot be null';

            if (request.Columns == null || request.Columns.length == 0)
                throw 'No Columns specified on the request';

            return connectorInstance.createGridResponse(request, subset);
        }
    }
};