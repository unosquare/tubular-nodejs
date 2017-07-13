
class GridDataResponse {
    constructor(args) {
        this.Counter = 0;
        this.Payload = [];
        this.TotalRecordCount = 0;
        this.FilteredRecordCount = 0;
        this.TotalPages = 0;
        this.CurrentPage = 0;
        this.AggregationPayload = {};

        Object.assign(this, args);
    }
}

module.exports = GridDataResponse;