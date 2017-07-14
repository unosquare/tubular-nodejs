var _ = require('lodash');
var CompareOperator = require('../compare-operator');
var AggregationFunction = require('../aggregate-function');
var SortDirection = require('../sort-direction');
var GridDataResponse = require('../grid-data-response');

function getCompareOperator(operator) {
    switch (operator) {
        case CompareOperator.gte:
            return '>=';
        case CompareOperator.gt:
            return '>';
        case CompareOperator.lte:
            return '<=';
        case CompareOperator.lt:
            return '<';
        default:
            throw "Unsopported Compare Operator";
    }
}

function createGridResponse(request, subset) {
    let promises = [
        subset.clone().clearSelect()
            .count(`${request.Columns[0].Name} as tbResult`)
            .then(result => ({ TotalRecordCount: result[0].tbResult }))
    ];

    subset = applyFreeTextSearch(request, subset);
    subset = applyFiltering(request, subset);
    subset = applySorting(request, subset);

    promises.push(subset.clone().clearSelect()
        .count(`${request.Columns[0].Name} as tbResult`)
        .then(result => ({ FilteredRecordCount: result[0].tbResult })));

    let subsetForAggregates = subset.clone();

    promises.push(getAggregatePayload(request, subsetForAggregates)
        .then(values => ({ AggregationPayload: _.reduce(values, _.merge, {}) })));

    let response = new GridDataResponse({
        Counter: request.Counter,
        TotalPages: 1,
        CurrentPage: 1
    });

    return Promise.all(promises)
        .then(values => {
            response = _.reduce(values, _.merge, response);

            // Take with value -1 represents entire set
            if (request.Take > -1) {
                response.TotalPages = Math.ceil(response.FilteredRecordCount / request.Take);

                if (response.TotalPages > 0) {
                    response.CurrentPage = request.Skip / request.Take + 1;

                    if (request.Skip > 0) {
                        subset = subset.offset(request.Skip);
                    }
                }

                subset = subset.limit(request.Take);
            }

            return subset;
        })
        .then(rows => {
            response.Payload = rows.map(row => request.Columns.map(c => row[c.Name]));

            return response;
        });
}

function applySorting(request, subset) {
    let sortedColumns = _.filter(request.Columns, column => column.SortOrder > 0);

    if (sortedColumns.length > 0) {
        sortedColumns = _.sortBy(sortedColumns, ['SortOrder']);

        _.forEachRight(sortedColumns, column => subset.orderBy(column.Name, (column.SortDirection == SortDirection.ascending ? 'asc' : 'desc')));
    } else {
        // Default sorting
        subset = subset.orderBy(request.Columns[0].Name, 'asc');
    }

    return subset;
}

function getAggregatePayload(request, subset) {
    let aggregateColumns = _.filter(request.Columns, column => column.Aggregate && column.Aggregate != 'None');

    return Promise.all(_.map(aggregateColumns, column => {
        // Do not disrupt the original query chain
        let copyOfSubset = subset.clone();

        // in order to work with aggregates
        copyOfSubset.clearSelect();

        switch (column.Aggregate) {
            case AggregationFunction.sum:
                copyOfSubset = copyOfSubset.sum(`${column.Name} as tbResult`);
                break;
            case AggregationFunction.average:
                copyOfSubset = copyOfSubset.avg(`${column.Name} as tbResult`);
                break;
            case AggregationFunction.max:
                copyOfSubset = copyOfSubset.max(`${column.Name} as tbResult`);
                break;
            case AggregationFunction.min:
                copyOfSubset = copyOfSubset.min(`${column.Name} as tbResult`);
                break;
            case AggregationFunction.count:
                copyOfSubset = copyOfSubset.count(`${column.Name} as tbResult`);
                break;
            case AggregationFunction.distinctCount:
                copyOfSubset = copyOfSubset.countDistinct(`${column.Name} as tbResult`);
                break;
            default:
                throw "Unsupported aggregate function";
        }

        return copyOfSubset.then(result => ({ [column.Name]: result[0].tbResult }));
    }));
}

function applyFreeTextSearch(request, subset) {
    // Free text-search 
    if (request.Search && request.Search.Operator == CompareOperator.auto) {
        let searchableColumns = _.filter(request.Columns, 'Searchable');

        if (searchableColumns.length > 0) {
            subset = subset.where(function () {
                let isFirst = true;
                let _subset = this;
                searchableColumns.forEach(column => {
                    if (isFirst) {
                        _subset.where(column.Name, 'LIKE', '%' + request.Search.Text + '%');
                        isFirst = false;
                    }
                    else
                        _subset.orWhere(column.Name, 'LIKE', '%' + request.Search.Text + '%');
                });
            })
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
                subset = subset.where(filterableColumn.Name, filterableColumn.Filter.Text);
                break;
            case CompareOperator.notEquals:
                subset = subset.whereNot(filterableColumn.Name, filterableColumn.Filter.Text);
                break;
            case CompareOperator.contains:
                subset = subset.where(filterableColumn.Name, 'LIKE', `%${filterableColumn.Filter.Text}%`);
                break;
            case CompareOperator.notContains:
                subset = subset.whereNot(filterableColumn.Name, 'LIKE', `%${filterableColumn.Filter.Text}%`);
                break;
            case CompareOperator.startsWith:
                subset = subset.where(filterableColumn.Name, 'LIKE', `${filterableColumn.Filter.Text}%`);
                break;
            case CompareOperator.notStartsWith:
                subset = subset.whereNot(filterableColumn.Name, 'LIKE', `${filterableColumn.Filter.Text}%`);
                break;
            case CompareOperator.endsWith:
                subset = subset.where(filterableColumn.Name, 'LIKE', `%${filterableColumn.Filter.Text}`);
                break;
            case CompareOperator.notEndsWith:
                subset = subset.whereNot(filterableColumn.Name, 'LIKE', `%${filterableColumn.Filter.Text}`);
                break;
            case CompareOperator.gt:
            case CompareOperator.gte:
            case CompareOperator.lt:
            case CompareOperator.lte:
                subset = subset.where(filterableColumn.Name, getCompareOperator(filterableColumn.Filter.Operator), filterableColumn.Filter.Text);
                break;
            case CompareOperator.between:
                subset = subset.whereBetween(filterableColumn.Name, [filterableColumn.Filter.Text, filterableColumn.Filter.Argument[0]]);
                break;
            default:
                throw "Unsupported Compare Operator";
        }
    });

    return subset;
}

module.exports = function (options) {
    return {
        createGridResponse: createGridResponse
    };
};