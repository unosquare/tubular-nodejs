class GridDataRequest {
    constructor(args) {
        this.Counter = 0;
        this.Search = {};
        this.Skip = 0;
        this.Take = 0;
        this.Columns = [];

        Object.assign(this, args);
    }
}

module.exports = GridDataRequest;