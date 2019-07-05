var tubular = require('./tubular')('jsondata');
var {GridRequest} = require('tubular-common');

describe("tubular", function () {
    it(" must define its interface", function () {
        expect(tubular).toBeDefined();
        expect(tubular.createGridResponse).toBeDefined();
    });

    it(" must fail when no columns", () => {
        expect(() => tubular.createGridResponse(new GridRequest(), {})).toThrow('No Columns specified on the request');
    });

    it(" must fail when no request", () => {
        expect(() => tubular.createGridResponse(null, {})).toThrow('"request" cannot be null');
    });

    it(" must fail when no subset", () => {
        expect(() => tubular.createGridResponse(new GridRequest(), null)).toThrow('"subset" cannot be null');
    });
});