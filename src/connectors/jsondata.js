var _ = require('lodash');
var CompareOperators = require('../compare-operators');

function createGridResponse(request, subset) {
    var response = {
        Counter: request.Counter,
        TotalRecordCount: subset.length
    };

    subset = applyFreeTextSearch(request, subset);
    subset = applyFiltering(request, subset);

    response.FilteredRecordCount = subset.length;

    // Take with value -1 represents entire set
    if (request.Take > -1) {
        response.TotalPages = Math.ceil(response.FilteredRecordCount / request.Take);

        if (response.TotalPages > 0) {
            response.CurrentPage = request.Skip / request.Take + 1;

            if (request.Skip > 0) {
                //subset = subset.offset(request.Skip);
            }
        }

        //subset = subset.limit(request.Take);
    }

    response.Payload = subset;

    return Promise.resolve(response);
}


function applyFreeTextSearch(request, subset) {
    // Free text-search 
    if (request.Search && request.Search.Operator == CompareOperators.auto) {
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
            case CompareOperators.equals:
                subset = subset.filter(row => row[filterableColumn.Name] == filterableColumn.Filter.Text);
                break;
            case CompareOperators.notEquals:
                subset = subset.filter(row => row[filterableColumn.Name] != filterableColumn.Filter.Text);
                break;
            case CompareOperators.contains:
                subset = subset.filter(row => row[filterableColumn.Name].indexOf(filterableColumn.Filter.Text) >= 0);
                break;
            case CompareOperators.notContains:
                subset = subset.filter(row => row[filterableColumn.Name].indexOf(filterableColumn.Filter.Text) < 0);
                break;
            case CompareOperators.startsWith:
                subset = subset.filter(row => row[filterableColumn.Name].startsWith(filterableColumn.Filter.Text));
                break;
            case CompareOperators.notStartsWith:
                subset = subset.filter(row => !row[filterableColumn.Name].startsWith(filterableColumn.Filter.Text));
                break;
            case CompareOperators.endsWith:
                subset = subset.filter(row => row[filterableColumn.Name].endsWith(filterableColumn.Filter.Text));
                break;
            case CompareOperators.notEndsWith:
                subset = subset.filter(row => !row[filterableColumn.Name].endsWith(filterableColumn.Filter.Text));
                break;
            // TODO: check for types
            case CompareOperators.gt:
                subset = subset.filter(row => row[filterableColumn.Name] > filterableColumn.Filter.Text);
                break;
            case CompareOperators.gte:
                subset = subset.filter(row => row[filterableColumn.Name] >= filterableColumn.Filter.Text);
                break;
            case CompareOperators.lt:
                subset = subset.filter(row => row[filterableColumn.Name] < filterableColumn.Filter.Text);
                break;
            case CompareOperators.lte:
                subset = subset.filter(row => row[filterableColumn.Name] <= filterableColumn.Filter.Text);
                break;
            case CompareOperators.between:
                subset = subset.filter(row => row[filterableColumn.Name] > filterableColumn.Filter.Text && row[filterableColumn.Name] < filterableColumn.Filter.Argument[0]);
                break;
        }
    });

    return subset;
}


module.exports = function (options) {
    return {
        createGridResponse: createGridResponse
    };
};