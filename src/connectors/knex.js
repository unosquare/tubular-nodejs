var _ = require('lodash');
var {CompareOperators} = require('tubular-common');
var {AggregateFunctions} = require('tubular-common');
var {ColumnSortDirection} = require('tubular-common');
var {GridResponse} = require('tubular-common');

function getCompareOperators(operator) {
    switch (operator) {
        case CompareOperators.Gte:
            return '>=';
        case CompareOperators.Gt:
            return '>';
        case CompareOperators.Lte:
            return '<=';
        case CompareOperators.Lt:
            return '<';
        default:
            throw 'Unsupported Compare Operator';
    }
}

function createGridResponse(request, subset) {
    let promises = [
        subset.clone().clearSelect()
            .count(`${request.columns[0].name} as tbResult`)
            .then(result => ({ totalRecordCount: result[0].tbResult }))
    ];

    subset = applyFreeTextSearch(request, subset);
    subset = applyFiltering(request, subset);
    subset = applySorting(request, subset);

    promises.push(subset.clone().clearSelect()
        .count(`${request.columns[0].name} as tbResult`)
        .then(result => ({ filteredRecordCount: result[0].tbResult })));

    let subsetForAggregates = subset.clone();

    promises.push(getAggregatePayload(request, subsetForAggregates)
        .then(values => ({ aggregationPayload: _.reduce(values, _.merge, {}) })));

    let response = new GridResponse({
        counter: request.counter,
        totalPages: 1,
        currentPage: 1
    });

    return Promise.all(promises)
        .then(values => {
            response = _.reduce(values, _.merge, response);

            // Take with value -1 represents entire set
            if (request.take > -1) {
                response.totalPages = Math.ceil(response.filteredRecordCount / request.take);

                if (response.totalPages > 0) {
                    response.currentPage = request.skip / request.take + 1;

                    if (request.skip > 0) {
                        subset = subset.offset(request.skip);
                    }
                }

                subset = subset.limit(request.take);
            }

            return subset;
        })
        .then(rows => {
            response.payload = rows.map(row => request.columns.map(c => row[c.name]));

            return response;
        });
}

function applySorting(request, subset) {
    let sortedColumns = _.filter(request.columns, column => column.sortOrder > 0);

    if (sortedColumns.length > 0) {
        sortedColumns = _.sortBy(sortedColumns, ['sortOrder']);

        _.forEachRight(sortedColumns, column => subset.orderBy(column.name, (column.sortDirection == ColumnSortDirection.Ascending ? 'asc' : 'desc')));
    } else {
        // Default sorting
        subset = subset.orderBy(request.columns[0].name, 'asc');
    }

    return subset;
}

function getAggregatePayload(request, subset) {
    let aggregateColumns = _.filter(request.columns, column => column.aggregate && column.aggregate != AggregateFunctions.None);
    
    return Promise.all(_.map(aggregateColumns, column => {
        // Do not disrupt the original query chain
        let copyOfSubset = subset.clone();

        // in order to work with aggregates
        copyOfSubset.clearSelect();

        switch (column.aggregate) {
            case AggregateFunctions.Sum:
                copyOfSubset = copyOfSubset.sum(`${column.name} as tbResult`);
                break;
            case AggregateFunctions.Average:
                copyOfSubset = copyOfSubset.avg(`${column.name} as tbResult`);
                break;
            case AggregateFunctions.Max:
                copyOfSubset = copyOfSubset.max(`${column.name} as tbResult`);
                break;
            case AggregateFunctions.Min:
                copyOfSubset = copyOfSubset.min(`${column.name} as tbResult`);
                break;
            case AggregateFunctions.Count:
                copyOfSubset = copyOfSubset.count(`${column.name} as tbResult`);
                break;
            case AggregateFunctions.DistinctCount:
                copyOfSubset = copyOfSubset.countDistinct(`${column.name} as tbResult`);
                break;
            default:
                throw 'Unsupported aggregate function';
        }

        return copyOfSubset.then(result => ({ [column.name]: result[0].tbResult }));
    }));
}

function applyFreeTextSearch(request, subset) {
    // Free text-search 
    if (request.search && request.search.operator == CompareOperators.Auto) {
        let searchableColumns = _.filter(request.columns, 'searchable');

        if (searchableColumns.length > 0) {
            subset = subset.where(function () {
                let isFirst = true;
                let _subset = this;
                searchableColumns.forEach(column => {
                    if (isFirst) {
                        _subset.where(column.name, 'LIKE', '%' + request.search.text + '%');
                        isFirst = false;
                    }
                    else
                        _subset.orWhere(column.name, 'LIKE', '%' + request.search.text + '%');
                });
            })
        }
    }

    return subset;
}

function applyFiltering(request, subset) {
    // Filter by columns
    let filteredColumns = request.columns.filter((column) =>
        (column.filter &&
        (column.filter.text || column.filter.argument) &&
        column.filter.operator != CompareOperators.None));

    filteredColumns.forEach(filterableColumn => {
        request.columns.find(column => column.name == filterableColumn.name).HasFilter = true;

        switch (filterableColumn.filter.operator) {
            case CompareOperators.Equals:
                subset = subset.where(filterableColumn.name, filterableColumn.filter.text);
                break;
            case CompareOperators.NotEquals:
                subset = subset.whereNot(filterableColumn.name, filterableColumn.filter.text);
                break;
            case CompareOperators.Contains:
                subset = subset.where(filterableColumn.name, 'LIKE', `%${filterableColumn.filter.text}%`);
                break;
            case CompareOperators.NotContains:
                subset = subset.whereNot(filterableColumn.name, 'LIKE', `%${filterableColumn.filter.text}%`);
                break;
            case CompareOperators.StartsWith:
                subset = subset.where(filterableColumn.name, 'LIKE', `${filterableColumn.filter.text}%`);
                break;
            case CompareOperators.NotStartsWith:
                subset = subset.whereNot(filterableColumn.name, 'LIKE', `${filterableColumn.filter.text}%`);
                break;
            case CompareOperators.EndsWith:
                subset = subset.where(filterableColumn.name, 'LIKE', `%${filterableColumn.filter.text}`);
                break;
            case CompareOperators.NotEndsWith:
                subset = subset.whereNot(filterableColumn.name, 'LIKE', `%${filterableColumn.filter.text}`);
                break;
            case CompareOperators.Gt:
            case CompareOperators.Gte:
            case CompareOperators.Lt:
            case CompareOperators.Lte:
                subset = subset.where(filterableColumn.name, getCompareOperators(filterableColumn.filter.operator), filterableColumn.filter.text);
                break;
            case CompareOperators.Between:
                subset = subset.whereBetween(filterableColumn.name, [filterableColumn.filter.text, filterableColumn.filter.argument[0]]);
                break;
            default:
                throw 'Unsupported Compare Operator';
        }
    });

    return subset;
}

module.exports = function () {
    return {
        createGridResponse: createGridResponse
    };
};