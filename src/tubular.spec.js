var tubular = require('./tubular')('jsondata');

describe("tubular", function () {
    it(" must define its interface", function () {
        expect(tubular).toBeDefined();
        expect(tubular.createGridResponse).toBeDefined();
    });

    it(" must failed when no columns", () => {
        expect(() => tubular.createGridResponse({}, {})).toThrow('No Columns specified on the request');
    });

    it(" must failed when no request", () => {
        expect(() => tubular.createGridResponse(null, {})).toThrow('"request" cannot be null');
    });

    it(" must failed when no subset", () => {
        expect(() => tubular.createGridResponse({}, null)).toThrow('"subset" cannot be null');
    });
});