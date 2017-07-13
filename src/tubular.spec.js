var tubular = require('./tubular')('jsondata');
var GridDataRequest = require('./grid-data-request');

describe("tubular", function () {
    it(" must define its interface", function () {
        expect(tubular).toBeDefined();
        expect(tubular.createGridResponse).toBeDefined();
    });

    it(" must failed when no columns", () => {
        expect(() => tubular.createGridResponse(new GridDataRequest(), {})).toThrow('No Columns specified on the request');
    });

    it(" must failed when no request", () => {
        expect(() => tubular.createGridResponse(null, {})).toThrow('"request" must be an instance of GridDataRequest');
    });

    it(" must failed when no subset", () => {
        expect(() => tubular.createGridResponse(new GridDataRequest(), null)).toThrow('"subset" cannot be null');
    });
});