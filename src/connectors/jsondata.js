var _ = require('lodash');
var CompareOperator = require('../compare-operator');
var AggregationFunction = require('../aggregate-function');
var SortDirection = require('../sort-direction');
var GridDataResponse = require('../grid-data-response');

function createGridResponse(request, subset) {

    let response = new GridDataResponse({
        Counter: request.Counter,
        TotalRecordCount: subset.length,
        CurrentPage: 1
    });

    subset = applyFreeTextSearch(request, subset);
    subset = applyFiltering(request, subset);
    subset = applySorting(request, subset);

    response.FilteredRecordCount = subset.length;

    let offset = request.Skip;
    let limit = request.Take;

    // Take with value -1 represents entire set
    if (request.Take > -1) {
        response.TotalPages = Math.ceil(response.FilteredRecordCount / request.Take);

        if (response.TotalPages > 0) {
            response.CurrentPage = request.Skip / request.Take + 1;
        }
    }

    response.AggregationPayload = getAggregatePayload(request, subset);

    subset = _.slice(subset, offset, offset + limit);
    response.Payload = subset.map(row => request.Columns.map(c => row[c.Name]));

    return Promise.resolve(response);
}


function applyFreeTextSearch(request, subset) {
    // Free text-search 
    if (request.Search && request.Search.Operator == CompareOperator.auto) {
        let searchableColumns = _.filter(request.Columns, 'Searchable');

        if (searchableColumns.length > 0) {
            var filter = request.Search.Text.toLowerCase();
            return _.filter(subset, item => _.some(searchableColumns, x => item[x.Name].toLowerCase().indexOf(filter) > -1));
        }
    }

    return subset;
}

function applyFiltering(request, subset) {

    // Filter by columns
    let filteredColumns = request.Columns.filter((column) => column.Filter && (column.Filter.Text || column.Filter.Argument));

    filteredColumns.forEach(filterableColumn => {

        request.Columns.find(column => column.Name == filterableColumn.Name).HasFilter = true;

        switch (filterableColumn.Filter.Operator) {
            case CompareOperator.equals:
                subset = subset.filter(row => row[filterableColumn.Name] == filterableColumn.Filter.Text);
                break;
            case CompareOperator.notEquals:
                subset = subset.filter(row => row[filterableColumn.Name] != filterableColumn.Filter.Text);
                break;
            case CompareOperator.contains:
                subset = subset.filter(row => row[filterableColumn.Name].indexOf(filterableColumn.Filter.Text) >= 0);
                break;
            case CompareOperator.notContains:
                subset = subset.filter(row => row[filterableColumn.Name].indexOf(filterableColumn.Filter.Text) < 0);
                break;
            case CompareOperator.startsWith:
                subset = subset.filter(row => row[filterableColumn.Name].toLowerCase().startsWith(filterableColumn.Filter.Text));
                break;
            case CompareOperator.notStartsWith:
                subset = subset.filter(row => !row[filterableColumn.Name].toLowerCase().startsWith(filterableColumn.Filter.Text));
                break;
            case CompareOperator.endsWith:
                subset = subset.filter(row => row[filterableColumn.Name].toLowerCase().endsWith(filterableColumn.Filter.Text));
                break;
            case CompareOperator.notEndsWith:
                subset = subset.filter(row => !row[filterableColumn.Name].toLowerCase().endsWith(filterableColumn.Filter.Text));
                break;
            // TODO: check for types
            case CompareOperator.gt:
                subset = subset.filter(row => row[filterableColumn.Name] > filterableColumn.Filter.Text);
                break;
            case CompareOperator.gte:
                subset = subset.filter(row => row[filterableColumn.Name] >= filterableColumn.Filter.Text);
                break;
            case CompareOperator.lt:
                subset = subset.filter(row => row[filterableColumn.Name] < filterableColumn.Filter.Text);
                break;
            case CompareOperator.lte:
                subset = subset.filter(row => row[filterableColumn.Name] <= filterableColumn.Filter.Text);
                break;
            case CompareOperator.between:
                subset = subset.filter(row => row[filterableColumn.Name] > filterableColumn.Filter.Text && row[filterableColumn.Name] < filterableColumn.Filter.Argument[0]);
                break;
            default:
                throw "Unsupported Compare Operator";
        }
    });

    return subset;
}


function applySorting(request, subset) {
    let sortedColumns = _.filter(request.Columns, column => column.SortOrder > 0);

    if (sortedColumns.length > 0) {
        sortedColumns = _.sortBy(sortedColumns, ['SortOrder']);

        let columns = [],
            orders = [];

        _.forEachRight(sortedColumns, column => {
            columns.push(column.Name);
            orders.push((column.SortDirection == SortDirection.ascending ? 'asc' : 'desc'));
        });

        subset = _.orderBy(subset, columns, orders);
    } else {
        // Default sorting
        subset = _.orderBy(subset, request.Columns[0].Name, 'asc');
    }

    return subset;
}

function getAggregatePayload(request, subset) {
    let aggregateColumns = _.filter(request.Columns, column => column.Aggregate && column.Aggregate != AggregationFunction.none);

    const results = _.map(aggregateColumns, column => {
        let value;
        switch (column.Aggregate) {
            case AggregationFunction.sum:
                value = _.sumBy(subset, column.Name);
                break;
            case AggregationFunction.average:
                value = _.meanBy(subset, column.Name);
                break;
            case AggregationFunction.max:
                // .maxBy returns the object containing the max value
                value = _.maxBy(subset, column.Name)[column.Name];
                break;
            case AggregationFunction.min:
                // .minBy returns the object containing the min value
                value = _.minBy(subset, column.Name)[column.Name];
                break;
            case AggregationFunction.count:
                value = subset.length;
                break;
            case AggregationFunction.distinctCount:
                value = _.uniqWith(subset, (a, b) => {
                    return a[column.Name] == b[column.Name];
                }).length;
                break;
            default:
                throw "Unsupported aggregate function";
        }

        return { [column.Name]: value };
    });

    return _.reduce(results, _.merge, {});
}

module.exports = function (options) {
    return {
        createGridResponse: createGridResponse
    };
};