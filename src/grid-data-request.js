const currentTimezone = new Date().getTimezoneOffset();

class GridDataRequest {
    constructor(args) {
        this.Counter = 0;
        this.Search = {};
        this.Skip = 0;
        this.Take = 0;
        this.Columns = [];
        this.TimezoneOffset = currentTimezone;

        Object.assign(this, args);
    }
}

module.exports = GridDataRequest;