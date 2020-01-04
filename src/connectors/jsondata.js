var _ = require('lodash');
var { CompareOperators } = require('tubular-common');
var { AggregateFunctions } = require('tubular-common');
var { ColumnSortDirection } = require('tubular-common');
var { GridResponse } = require('tubular-common');

function createGridResponse(request, subset) {
    let response = new GridResponse(request.counter);
    response.totalRecordCount = subset.length;
    response.currentPage = 1;

    subset = applyFreeTextSearch(request, subset);
    subset = applyFiltering(request, subset);
    subset = applySorting(request, subset);

    response.filteredRecordCount = subset.length;

    let offset = request.skip;
    let limit = request.take;

    // Take with value -1 represents entire set
    if (request.take > -1) {
        response.totalPages = Math.ceil(response.filteredRecordCount / request.take);

        if (response.totalPages > 0) {
            response.currentPage = request.skip / request.take + 1;
        }
    }

    response.aggregationPayload = getAggregatePayload(request, subset);

    subset = _.slice(subset, offset, offset + limit);
    response.payload = subset.map(row => request.columns.map(c => row[c.name]));

    return Promise.resolve(response);
}


function applyFreeTextSearch(request, subset) {
    if (request.search && request.search.operator == CompareOperators.Auto) {
        let searchableColumns = _.filter(request.columns, 'searchable');

        if (searchableColumns.length > 0) {
            var filter = request.search.text.toLowerCase();
            return _.filter(subset, item => _.some(searchableColumns, x => item[x.name].toLowerCase().indexOf(filter) > -1));
        }
    }

    return subset;
}

function applyFiltering(request, subset) {
    // Filter by columns
    let filteredColumns = request.columns.filter((column) =>
        column.filter &&
        (column.filter.text || column.filter.argument) &&
        column.filter &&
        column.filter.operator != CompareOperators.None);

    filteredColumns.forEach(filterableColumn => {

        request.columns.find(column => column.name == filterableColumn.name).hasFilter = true;

        switch (filterableColumn.filter.operator) {
            case CompareOperators.Equals:
                subset = subset.filter(row => row[filterableColumn.name] == filterableColumn.filter.text);
                break;
            case CompareOperators.NotEquals:
                subset = subset.filter(row => row[filterableColumn.name] != filterableColumn.filter.text);
                break;
            case CompareOperators.Contains:
                subset = subset.filter(row => row[filterableColumn.name].indexOf(filterableColumn.filter.text) >= 0);
                break;
            case CompareOperators.NotContains:
                subset = subset.filter(row => row[filterableColumn.name].indexOf(filterableColumn.filter.text) < 0);
                break;
            case CompareOperators.StartsWith:
                subset = subset.filter(row => row[filterableColumn.name].toLowerCase().startsWith(filterableColumn.filter.text));
                break;
            case CompareOperators.NotStartsWith:
                subset = subset.filter(row => !row[filterableColumn.name].toLowerCase().startsWith(filterableColumn.filter.text));
                break;
            case CompareOperators.EndsWith:
                subset = subset.filter(row => row[filterableColumn.name].toLowerCase().endsWith(filterableColumn.filter.text));
                break;
            case CompareOperators.NotEndsWith:
                subset = subset.filter(row => !row[filterableColumn.name].toLowerCase().endsWith(filterableColumn.filter.text));
                break;
            // TODO: check for types
            case CompareOperators.Gt:
                subset = subset.filter(row => row[filterableColumn.name] > filterableColumn.filter.text);
                break;
            case CompareOperators.Gte:
                subset = subset.filter(row => row[filterableColumn.name] >= filterableColumn.filter.text);
                break;
            case CompareOperators.Lt:
                subset = subset.filter(row => row[filterableColumn.name] < filterableColumn.filter.text);
                break;
            case CompareOperators.Lte:
                subset = subset.filter(row => row[filterableColumn.name] <= filterableColumn.filter.text);
                break;
            case CompareOperators.Between:
                subset = subset.filter(row => row[filterableColumn.name] > filterableColumn.filter.text && row[filterableColumn.name] < filterableColumn.filter.argument[0]);
                break;
            default:
                throw 'Unsupported Compare Operator';
        }
    });

    return subset;
}


function applySorting(request, subset) {
    let sortedColumns = _.filter(request.columns, column => column.sortOrder > 0);

    if (sortedColumns.length > 0) {
        sortedColumns = _.sortBy(sortedColumns, ['sortOrder']);

        let columns = [],
            orders = [];

        _.forEachRight(sortedColumns, column => {
            columns.push(column.name);
            orders.push((column.sortDirection == ColumnSortDirection.Ascending ? 'asc' : 'desc'));
        });

        subset = _.orderBy(subset, columns, orders);
    } else {
        // Default sorting
        subset = _.orderBy(subset, request.columns[0].name, 'asc');
    }

    return subset;
}

function getAggregatePayload(request, subset) {
    let aggregateColumns = _.filter(request.columns, column => column.aggregate && column.aggregate != AggregateFunctions.None);

    const results = _.map(aggregateColumns, column => {
        let value;
        switch (column.aggregate) {
            case AggregateFunctions.Sum:
                value = _.sumBy(subset, column.name);
                break;
            case AggregateFunctions.Average:
                value = _.meanBy(subset, column.name);
                break;
            case AggregateFunctions.Max:
                // .maxBy returns the object containing the max value
                value = _.maxBy(subset, column.name)[column.name];
                break;
            case AggregateFunctions.Min:
                // .minBy returns the object containing the min value
                value = _.minBy(subset, column.name)[column.name];
                break;
            case AggregateFunctions.Count:
                value = subset.length;
                break;
            case AggregateFunctions.DistinctCount:
                value = _.uniqWith(subset, (a, b) => {
                    return a[column.name] == b[column.name];
                }).length;
                break;
            default:
                throw 'Unsupported aggregate function';
        }

        return { [column.name]: value };
    });

    return _.reduce(results, _.merge, {});
}

module.exports = function () {
    return {
        createGridResponse: createGridResponse
    };
};