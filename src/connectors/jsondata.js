var _ = require('lodash');
var CompareOperators = require('../compare-operators');

function createGridResponse(request, subset) {
    var response = { 
        Counter: request.Counter, 
        TotalRecordCount: subset.length
    };

    subset = applyFreeTextSearch(request, subset);

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


module.exports = function(options){ 
    return {
        createGridResponse: createGridResponse
    };
};