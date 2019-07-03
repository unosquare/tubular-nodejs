var _ = require('lodash');
var { CompareOperators } = require('tubular-common');
var { AggregateFunctions } = require('tubular-common');
var { ColumnSortDirection } = require('tubular-common');
var { GridResponse } = require('tubular-common');

function createGridResponse(request, subset) {
    let response = new GridResponse(request.Counter);
    response.TotalRecordCount = subset.length;
    response.CurrentPage = 1;

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
    if (request.Search && request.Search.Operator == CompareOperators.AUTO) {
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
    let filteredColumns = request.Columns.filter((column) =>
        column.Filter &&
        (column.Filter.Text || column.Filter.Argument) &&
        column.Filter &&
        column.Filter.Operator != CompareOperators.NONE);

    filteredColumns.forEach(filterableColumn => {

        request.Columns.find(column => column.Name == filterableColumn.Name).HasFilter = true;

        switch (filterableColumn.Filter.Operator) {
            case CompareOperators.EQUALS:
                subset = subset.filter(row => row[filterableColumn.Name] == filterableColumn.Filter.Text);
                break;
            case CompareOperators.NOT_EQUALS:
                subset = subset.filter(row => row[filterableColumn.Name] != filterableColumn.Filter.Text);
                break;
            case CompareOperators.CONTAINS:
                subset = subset.filter(row => row[filterableColumn.Name].indexOf(filterableColumn.Filter.Text) >= 0);
                break;
            case CompareOperators.NOT_CONTAINS:
                subset = subset.filter(row => row[filterableColumn.Name].indexOf(filterableColumn.Filter.Text) < 0);
                break;
            case CompareOperators.STARTS_WITH:
                subset = subset.filter(row => row[filterableColumn.Name].toLowerCase().startsWith(filterableColumn.Filter.Text));
                break;
            case CompareOperators.NOT_STARTS_WITH:
                subset = subset.filter(row => !row[filterableColumn.Name].toLowerCase().startsWith(filterableColumn.Filter.Text));
                break;
            case CompareOperators.ENDS_WITH:
                subset = subset.filter(row => row[filterableColumn.Name].toLowerCase().endsWith(filterableColumn.Filter.Text));
                break;
            case CompareOperators.NOT_ENDS_WITH:
                subset = subset.filter(row => !row[filterableColumn.Name].toLowerCase().endsWith(filterableColumn.Filter.Text));
                break;
            // TODO: check for types
            case CompareOperators.GT:
                subset = subset.filter(row => row[filterableColumn.Name] > filterableColumn.Filter.Text);
                break;
            case CompareOperators.GTE:
                subset = subset.filter(row => row[filterableColumn.Name] >= filterableColumn.Filter.Text);
                break;
            case CompareOperators.LT:
                subset = subset.filter(row => row[filterableColumn.Name] < filterableColumn.Filter.Text);
                break;
            case CompareOperators.LTE:
                subset = subset.filter(row => row[filterableColumn.Name] <= filterableColumn.Filter.Text);
                break;
            case CompareOperators.BETWEEN:
                subset = subset.filter(row => row[filterableColumn.Name] > filterableColumn.Filter.Text && row[filterableColumn.Name] < filterableColumn.Filter.Argument[0]);
                break;
            default:
                throw 'Unsupported Compare Operator';
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
            orders.push((column.ColumnSortDirection == ColumnSortDirection.ASCENDING ? 'asc' : 'desc'));
        });

        subset = _.orderBy(subset, columns, orders);
    } else {
        // Default sorting
        subset = _.orderBy(subset, request.Columns[0].Name, 'asc');
    }

    return subset;
}

function getAggregatePayload(request, subset) {
    let aggregateColumns = _.filter(request.Columns, column => column.Aggregate && column.Aggregate != AggregateFunctions.NONE);

    const results = _.map(aggregateColumns, column => {
        let value;
        switch (column.Aggregate) {
            case AggregateFunctions.SUM:
                value = _.sumBy(subset, column.Name);
                break;
            case AggregateFunctions.AVERAGE:
                value = _.meanBy(subset, column.Name);
                break;
            case AggregateFunctions.MAX:
                // .maxBy returns the object containing the max value
                value = _.maxBy(subset, column.Name)[column.Name];
                break;
            case AggregateFunctions.MIN:
                // .minBy returns the object containing the min value
                value = _.minBy(subset, column.Name)[column.Name];
                break;
            case AggregateFunctions.COUNT:
                value = subset.length;
                break;
            case AggregateFunctions.DISTINCT_COUNT:
                value = _.uniqWith(subset, (a, b) => {
                    return a[column.Name] == b[column.Name];
                }).length;
                break;
            default:
                throw 'Unsupported aggregate function';
        }

        return { [column.Name]: value };
    });

    return _.reduce(results, _.merge, {});
}

module.exports = function () {
    return {
        createGridResponse: createGridResponse
    };
};