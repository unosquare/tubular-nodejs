var tubular = require('./tubular');
var knex = require('knex')({
    client: 'mysql',
    connection: {
        host: 'localhost',
        user: 'travis',
        port: 3306,
        password: '',
        database: 'sakila'
    }
});


describe("tubular", function () {

    it(" must define its interface", function () {
        expect(tubular).toBeDefined();
        expect(tubular.createGridResponse).toBeDefined();
    });

    it(" must failed when no columns", done => {
        let queryBuilder = knex.select('first_name', 'last_name', 'address_id').from('customer');
        tubular.createGridResponse({}, queryBuilder)
            .catch(error => {
                expect(error).toBe('No Columns specified on the request')
                done();
            });
    });

    it(" must failed when no request", done => {
        let queryBuilder = knex.select('first_name', 'last_name', 'address_id').from('customer');

        tubular.createGridResponse(null, queryBuilder)
            .catch(error => {
                expect(error).toBe('"request" cannot be null')
                done();
            });
    });

    it(" use free text search", done => {
        const skip = 0,
            take = 10,
            filteredCount = 31,
            totalRecordCount = 599;

        let queryBuilder = knex.select('first_name', 'last_name', 'address_id').from('customer');

        let request = {
            Skip: skip,
            Take: take,
            Counter: 1,
            Columns: [
                { Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true },
                { Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true },
                { Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false }
            ],
            Search: {
                Name: '',
                Text: 'And',
                Argument: [],
                Operator: 'Auto',
                HasFilter: false
            }
        };

        tubular.createGridResponse(request, queryBuilder)
            .then(response => {
                expect(response.Counter).toBeDefined();
                expect(response.TotalRecordCount).toBe(599);
                expect(response.FilteredRecordCount).toBe(31);
                expect(response.TotalPages).toBe(Math.ceil(filteredCount / take));
                expect(response.Payload.length).toBeDefined(take);
                done();
            });
    });

    // it(" filters by one column", function () {
    //     let queryBuilder = knex.select('Title', 'Author', 'Year').from('Books');

    //     let request = {
    //         Columns: [
    //             {
    //                 Name: 'Title', Label: 'Title', Sortable: true, Searchable: true, Filter: {
    //                     Name: '',
    //                     Text: 'Hola',
    //                     Argument: [],
    //                     Operator: 'Contains',
    //                     HasFilter: false
    //                 }
    //             },
    //             { Name: 'Author', Label: 'Author', Sortable: true, Searchable: true },
    //             { Name: 'Year', Label: 'Year', Sortable: true, Searchable: true }
    //         ]
    //     };

    //     let expected = "select [Title], [Author], [Year] from [Books] where [Title] LIKE '%Hola%'";
    //     let result = tubular.applyFiltering(request, queryBuilder).toString();

    //     expect(result).toBe(expected);
    // });

    // it(" filters by two column", function () {
    //     let queryBuilder = knex.select('Title', 'Author', 'Year').from('Books');

    //     let request = {
    //         Columns: [
    //             {
    //                 Name: 'Title', Label: 'Title', Sortable: true, Searchable: true, Filter: {
    //                     Name: '',
    //                     Text: 'Hola',
    //                     Argument: [],
    //                     Operator: 'Contains',
    //                     HasFilter: false
    //                 }
    //             },
    //             {
    //                 Name: 'Author', Label: 'Author', Sortable: true, Searchable: true, Filter: {
    //                     Name: '',
    //                     Text: 'Other',
    //                     Argument: [],
    //                     Operator: 'Contains',
    //                     HasFilter: false
    //                 }
    //             },
    //             { Name: 'Year', Label: 'Year', Sortable: true, Searchable: true }
    //         ],
    //         Search: {
    //             Name: '',
    //             Text: 'Hola',
    //             Argument: ['Hola'],
    //             Operator: 'Auto',
    //             HasFilter: false
    //         }
    //     };

    //     let expected = "select [Title], [Author], [Year] from [Books] where [Title] LIKE '%Hola%' and [Author] LIKE '%Other%'";
    //     let result = tubular.applyFiltering(request, queryBuilder).toString();

    //     expect(result).toBe(expected);
    // });

    // it(" combines search and filter", function () {
    //     let queryBuilder = knex.select('Title', 'Author', 'Year').from('Books');

    //     let request = {
    //         Columns: [
    //             {
    //                 Name: 'Title', Label: 'Title', Sortable: true, Searchable: true, Filter: {
    //                     Name: '',
    //                     Text: 'Hola',
    //                     Argument: [],
    //                     Operator: 'Contains',
    //                     HasFilter: false
    //                 }
    //             },
    //             {
    //                 Name: 'Author', Label: 'Author', Sortable: true, Searchable: true, Filter: {
    //                     Name: '',
    //                     Text: 'Other',
    //                     Argument: [],
    //                     Operator: 'Contains',
    //                     HasFilter: false
    //                 }
    //             },
    //             { Name: 'Year', Label: 'Year', Sortable: true, Searchable: false }
    //         ],
    //         Search: {
    //             Name: '',
    //             Text: 'Hola',
    //             Argument: ['Hola'],
    //             Operator: 'Auto',
    //             HasFilter: false
    //         }
    //     };

    //     let subset = tubular.applyFreeTextSearch(request, queryBuilder);

    //     let expected = "select [Title], [Author], [Year] from [Books] where ([Title] LIKE '%Hola%' or [Author] LIKE '%Hola%') and [Title] LIKE '%Hola%' and [Author] LIKE '%Other%'";
    //     let result = tubular.applyFiltering(request, subset).toString();

    //     expect(result).toBe(expected);
    // });

    // it(" sorts by default column", function () {
    //     let queryBuilder = knex.select('Title', 'Author', 'Year').from('Books');

    //     let request = {
    //         Columns: [
    //             {
    //                 Name: 'Title', Label: 'Title', Sortable: true, Searchable: true, Filter: {
    //                     Name: '',
    //                     Text: 'Hola',
    //                     Argument: [],
    //                     Operator: 'Contains',
    //                     HasFilter: false
    //                 }
    //             },
    //             { Name: 'Author', Label: 'Author', Sortable: true, Searchable: true },
    //             { Name: 'Year', Label: 'Year', Sortable: true, Searchable: true }
    //         ]
    //     };

    //     let subset = tubular.applyFreeTextSearch(request, queryBuilder);
    //     subset = tubular.applyFiltering(request, subset);
    //     subset = tubular.applySorting(request, subset);

    //     let expected = "select [Title], [Author], [Year] from [Books] where [Title] LIKE '%Hola%' order by [Title] asc";
    //     let result = subset.toString();

    //     expect(result).toBe(expected);
    // });

    // it(" sorts by specified column", function () {
    //     let queryBuilder = knex.select('Title', 'Author', 'Year').from('Books');

    //     let request = {
    //         Columns: [
    //             {
    //                 Name: 'Title', Label: 'Title', Sortable: true, Searchable: true, Filter: {
    //                     Name: '',
    //                     Text: 'Hola',
    //                     Argument: [],
    //                     Operator: 'Contains',
    //                     HasFilter: false
    //                 }
    //             },
    //             { Name: 'Author', Label: 'Author', Sortable: true, SortOrder: 2, SortDirection: 'Ascending', Searchable: true },
    //             { Name: 'Year', Label: 'Year', Sortable: true, Searchable: true }
    //         ]
    //     };

    //     let subset = tubular.applyFreeTextSearch(request, queryBuilder);
    //     subset = tubular.applyFiltering(request, subset);
    //     subset = tubular.applySorting(request, subset);

    //     let expected = "select [Title], [Author], [Year] from [Books] where [Title] LIKE '%Hola%' order by [Author] asc";
    //     let result = subset.toString();

    //     expect(result).toBe(expected);
    // });

    // it(" sorts by two columns", function () {
    //     let queryBuilder = knex.select('Title', 'Author', 'Year').from('Books');

    //     let request = {
    //         Columns: [
    //             {
    //                 Name: 'Title', Label: 'Title', Sortable: true, Searchable: true, Filter: {
    //                     Name: '',
    //                     Text: 'Hola',
    //                     Argument: [],
    //                     Operator: 'Contains',
    //                     HasFilter: false
    //                 }
    //             },
    //             { Name: 'Author', Label: 'Author', Sortable: true, SortOrder: 3, SortDirection: 'Ascending', Searchable: true },
    //             { Name: 'Year', Label: 'Year', Sortable: true, SortOrder: 2, SortDirection: 'Descending', Searchable: true }
    //         ]
    //     };

    //     let subset = tubular.applyFreeTextSearch(request, queryBuilder);
    //     subset = tubular.applyFiltering(request, subset);
    //     subset = tubular.applySorting(request, subset);

    //     let expected = "select [Title], [Author], [Year] from [Books] where [Title] LIKE '%Hola%' order by [Author] asc, [Year] desc";
    //     let result = subset.toString();

    //     expect(result).toBe(expected);
    // });

    // it(" use aggregate on one column", function () {
    //     let queryBuilder = knex.select('Title', 'Author', 'Year').from('Books');

    //     let request = {
    //         Columns: [
    //             {
    //                 Name: 'Title', Label: 'Title', Sortable: true, Searchable: true, Filter: {
    //                     Name: '',
    //                     Text: 'Hola',
    //                     Argument: [],
    //                     Operator: 'Contains',
    //                     HasFilter: false
    //                 }
    //             },
    //             { Name: 'Author', Label: 'Author', Sortable: true, SortOrder: 3, SortDirection: 'Ascending', Searchable: true, Aggregate: "Count" },
    //             { Name: 'Year', Label: 'Year', Sortable: true, SortOrder: 2, SortDirection: 'Descending', Searchable: true }
    //         ]
    //     };

    //     let subset = tubular.applyFreeTextSearch(request, queryBuilder);
    //     subset = tubular.applyFiltering(request, subset);
    //     // subset = tubular.applySorting(request, subset);

    //     let expected = "select [Title], [Author], [Year] from [Books] where [Title] LIKE '%Hola%'";
    //     let result = subset.toString();
    //     expect(result).toBe(expected);

    //     let expectedAggregate = "select count([Author]) from [Books] where [Title] LIKE '%Hola%'";
    //     let resultAggregate = tubular.getAggregatePayloads(request, subset);

    //     expect(resultAggregate.Author).toBeDefined();
    //     expect(resultAggregate.Author.toString()).toBe(expectedAggregate);
    // });

    // it(" use aggregate on two columns", function () {
    //     let queryBuilder = knex.select('Title', 'Author', 'Year').from('Books');

    //     let request = {
    //         Columns: [
    //             {
    //                 Name: 'Title', Label: 'Title', Sortable: true, Searchable: true, Filter: {
    //                     Name: '',
    //                     Text: 'Hola',
    //                     Argument: [],
    //                     Operator: 'Contains',
    //                     HasFilter: false
    //                 }
    //             },
    //             { Name: 'Author', Label: 'Author', Sortable: true, SortOrder: 3, SortDirection: 'Ascending', Searchable: true, Aggregate: "Count" },
    //             { Name: 'Year', Label: 'Year', Sortable: true, SortOrder: 2, SortDirection: 'Descending', Searchable: true, Aggregate: "Sum" }
    //         ]
    //     };

    //     let subset = tubular.applyFreeTextSearch(request, queryBuilder);
    //     subset = tubular.applyFiltering(request, subset);
    //     // subset = tubular.applySorting(request, subset);

    //     let expected = "select [Title], [Author], [Year] from [Books] where [Title] LIKE '%Hola%'";
    //     let result = subset.toString();
    //     expect(result).toBe(expected);

    //     let authorAggregate = "select count([Author]) from [Books] where [Title] LIKE '%Hola%'";
    //     let yearAggregate = "select sum([Year]) from [Books] where [Title] LIKE '%Hola%'";
    //     let resultAggregate = tubular.getAggregatePayloads(request, subset);

    //     expect(resultAggregate.Author).toBeDefined();
    //     expect(resultAggregate.Author.toString()).toBe(authorAggregate);

    //     expect(resultAggregate.Year).toBeDefined();
    //     expect(resultAggregate.Year.toString()).toBe(yearAggregate);
    // });

    // it(" use all possible aggregates", function () {
    //     let queryBuilder = knex.select('Title', 'Author', 'Year').from('Books');

    //     let request = {
    //         Columns: [
    //             {
    //                 Name: 'Title', Label: 'Title', Sortable: true, Searchable: true, Filter: {
    //                     Name: '',
    //                     Text: 'Hola',
    //                     Argument: [],
    //                     Operator: 'Contains',
    //                     HasFilter: false
    //                 }
    //             },
    //             { Name: 'AverageColumn', Label: 'AverageColumn', Sortable: true, SortDirection: 'Descending', Searchable: true, Aggregate: "Average" },
    //             { Name: 'CountColumn', Label: 'CountColumn', Sortable: true, SortDirection: 'Ascending', Searchable: true, Aggregate: "Count" },
    //             { Name: 'SumColumn', Label: 'SumColumn', Sortable: true, SortDirection: 'Ascending', Searchable: true, Aggregate: "Sum" },
    //             { Name: 'MaxColumn', Label: 'MaxColumn', Sortable: true, SortDirection: 'Ascending', Searchable: true, Aggregate: "Max" },
    //             { Name: 'MinColumn', Label: 'MinColumn', Sortable: true, SortDirection: 'Ascending', Searchable: true, Aggregate: "Min" },
    //             { Name: 'DistinctCountColumn', Label: 'DistinctCountColumn', Sortable: true, SortDirection: 'Ascending', Searchable: true, Aggregate: "DistinctCount" }

    //         ]
    //     };

    //     let subset = tubular.applyFreeTextSearch(request, queryBuilder);
    //     subset = tubular.applyFiltering(request, subset);

    //     let expected = "select [Title], [Author], [Year] from [Books] where [Title] LIKE '%Hola%'";
    //     let result = subset.toString();
    //     expect(result).toBe(expected);

    //     let avgAggregate = "select avg([AverageColumn]) from [Books] where [Title] LIKE '%Hola%'";
    //     let countAggregate = "select count([CountColumn]) from [Books] where [Title] LIKE '%Hola%'";
    //     let sumAggregate = "select sum([SumColumn]) from [Books] where [Title] LIKE '%Hola%'";
    //     let maxAggregate = "select max([MaxColumn]) from [Books] where [Title] LIKE '%Hola%'";
    //     let minAggregate = "select min([MinColumn]) from [Books] where [Title] LIKE '%Hola%'";
    //     let distinctCountAggregate = "select count(distinct [DistinctCountColumn]) from [Books] where [Title] LIKE '%Hola%'";
    //     let resultAggregate = tubular.getAggregatePayloads(request, subset);

    //     expect(resultAggregate.AverageColumn).toBeDefined();
    //     expect(resultAggregate.AverageColumn.toString()).toBe(avgAggregate);

    //     expect(resultAggregate.CountColumn).toBeDefined();
    //     expect(resultAggregate.CountColumn.toString()).toBe(countAggregate);

    //     expect(resultAggregate.SumColumn).toBeDefined();
    //     expect(resultAggregate.SumColumn.toString()).toBe(sumAggregate);

    //     expect(resultAggregate.MaxColumn).toBeDefined();
    //     expect(resultAggregate.MaxColumn.toString()).toBe(maxAggregate);

    //     expect(resultAggregate.MinColumn).toBeDefined();
    //     expect(resultAggregate.MinColumn.toString()).toBe(minAggregate);

    //     expect(resultAggregate.DistinctCountColumn).toBeDefined();
    //     expect(resultAggregate.DistinctCountColumn.toString()).toBe(distinctCountAggregate);
    // });

});