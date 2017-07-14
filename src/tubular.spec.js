var tubular = require('./tubular')('jsondata');
var GridDataRequest = require('./grid-data-request');

describe("tubular", function () {
    it(" must define its interface", function () {
        expect(tubular).toBeDefined();
        expect(tubular.createGridResponse).toBeDefined();
    });

    it(" must fail when no columns", () => {
        expect(() => tubular.createGridResponse(new GridDataRequest(), {})).toThrow('No Columns specified on the request');
    });

    it(" must fail when no request", () => {
        expect(() => tubular.createGridResponse(null, {})).toThrow('"request" cannot be null');
    });

    it(" must fail when no subset", () => {
        expect(() => tubular.createGridResponse(new GridDataRequest(), null)).toThrow('"subset" cannot be null');
    });
});