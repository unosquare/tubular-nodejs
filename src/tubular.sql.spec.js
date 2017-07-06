var Tubular = require('../../src/tubular');
var knex = require('knex')({
            client: 'mysql',
            connection: {
                host : '127.0.0.1',
                user : 'travis',
                password : '',
                database : 'sakila'
            }
        });

describe("Tubular", function () {

    it(" must define its interface", function () {
        expect(Tubular).toBeDefined();
        expect(Tubular.createGridResponse).toBeDefined();
        expect(Tubular.applyFiltering).toBeDefined();
        expect(Tubular.applyFreeTextSearch).toBeDefined();
        expect(Tubular.applySorting).toBeDefined();
    });

    it(" must connect to Mysql", done => {
        knex.raw('select 1+1 as result').then(() => { done(); });
    });

    it(" must failed when no columns", function () {
        let queryBuilder = knex.select('Title', 'Author', 'Year').from('Books');

        expect(function () { Tubular.createGridResponse({}, queryBuilder) }).toThrow('No Columns specified on the request');
        expect(function () { Tubular.createGridResponse({ Columns: [] }, queryBuilder) }).toThrow('No Columns specified on the request');
    });

    it(" use free text search", function () {
        let queryBuilder = knex.select('Title', 'Author', 'Year').from('Books');

        expect(function () { Tubular.createGridResponse({}, queryBuilder) }).toThrow('No Columns specified on the request');

        let request = {
            Columns: [
                { Name: 'Title', Label: 'Title', Sortable: true, Searchable: true },
                { Name: 'Author', Label: 'Author', Sortable: true, Searchable: true },
                { Name: 'Year', Label: 'Year', Sortable: true, Searchable: false }
            ],
            Search: {
                Name: '',
                Text: 'Hola',
                Argument: ['Hola'],
                Operator: 'Auto',
                HasFilter: false
            }
        };

        let expected = "select `Title`, `Author`, `Year` from `Books` where (`Title` LIKE '%Hola%' or `Author` LIKE '%Hola%')";
        let result = Tubular.applyFreeTextSearch(request, queryBuilder).toString();
        expect(result).toBe(expected);
    });

    it(" filters by one column", function () {
        let queryBuilder = knex.select('Title', 'Author', 'Year').from('Books');

        let request = {
            Columns: [
                {
                    Name: 'Title', Label: 'Title', Sortable: true, Searchable: true, Filter: {
                        Name: '',
                        Text: 'Hola',
                        Argument: [],
                        Operator: 'Contains',
                        HasFilter: false
                    }
                },
                { Name: 'Author', Label: 'Author', Sortable: true, Searchable: true },
                { Name: 'Year', Label: 'Year', Sortable: true, Searchable: true }
            ]
        };

        let expected = "select `Title`, `Author`, `Year` from `Books` where `Title` LIKE '%Hola%'";
        let result = Tubular.applyFiltering(request, queryBuilder).toString();

        expect(result).toBe(expected);
    });

    it(" filters by two column", function () {
        let queryBuilder = knex.select('Title', 'Author', 'Year').from('Books');

        let request = {
            Columns: [
                {
                    Name: 'Title', Label: 'Title', Sortable: true, Searchable: true, Filter: {
                        Name: '',
                        Text: 'Hola',
                        Argument: [],
                        Operator: 'Contains',
                        HasFilter: false
                    }
                },
                {
                    Name: 'Author', Label: 'Author', Sortable: true, Searchable: true, Filter: {
                        Name: '',
                        Text: 'Other',
                        Argument: [],
                        Operator: 'Contains',
                        HasFilter: false
                    }
                },
                { Name: 'Year', Label: 'Year', Sortable: true, Searchable: true }
            ],
            Search: {
                Name: '',
                Text: 'Hola',
                Argument: ['Hola'],
                Operator: 'Auto',
                HasFilter: false
            }
        };

        let expected = "select `Title`, `Author`, `Year` from `Books` where `Title` LIKE '%Hola%' and `Author` LIKE '%Other%'";
        let result = Tubular.applyFiltering(request, queryBuilder).toString();

        expect(result).toBe(expected);
    });

    it(" combines search and filter", function () {
        let queryBuilder = knex.select('Title', 'Author', 'Year').from('Books');

        let request = {
            Columns: [
                {
                    Name: 'Title', Label: 'Title', Sortable: true, Searchable: true, Filter: {
                        Name: '',
                        Text: 'Hola',
                        Argument: [],
                        Operator: 'Contains',
                        HasFilter: false
                    }
                },
                {
                    Name: 'Author', Label: 'Author', Sortable: true, Searchable: true, Filter: {
                        Name: '',
                        Text: 'Other',
                        Argument: [],
                        Operator: 'Contains',
                        HasFilter: false
                    }
                },
                { Name: 'Year', Label: 'Year', Sortable: true, Searchable: false }
            ],
            Search: {
                Name: '',
                Text: 'Hola',
                Argument: ['Hola'],
                Operator: 'Auto',
                HasFilter: false
            }
        };

        let subset = Tubular.applyFreeTextSearch(request, queryBuilder);

        let expected = "select `Title`, `Author`, `Year` from `Books` where (`Title` LIKE '%Hola%' or `Author` LIKE '%Hola%') and `Title` LIKE '%Hola%' and `Author` LIKE '%Other%'";
        let result = Tubular.applyFiltering(request, subset).toString();

        expect(result).toBe(expected);
    });

    it(" sorts by default column", function () {
        let queryBuilder = knex.select('Title', 'Author', 'Year').from('Books');

        let request = {
            Columns: [
                {
                    Name: 'Title', Label: 'Title', Sortable: true, Searchable: true, Filter: {
                        Name: '',
                        Text: 'Hola',
                        Argument: [],
                        Operator: 'Contains',
                        HasFilter: false
                    }
                },
                { Name: 'Author', Label: 'Author', Sortable: true, Searchable: true },
                { Name: 'Year', Label: 'Year', Sortable: true, Searchable: true }
            ]
        };

        let subset = Tubular.applyFreeTextSearch(request, queryBuilder);
        subset = Tubular.applyFiltering(request, subset);
        subset = Tubular.applySorting(request, subset);

        let expected = "select `Title`, `Author`, `Year` from `Books` where `Title` LIKE '%Hola%' order by `Title` asc";
        let result = subset.toString();

        expect(result).toBe(expected);
    });

    it(" sorts by specified column", function () {
        let queryBuilder = knex.select('Title', 'Author', 'Year').from('Books');

        let request = {
            Columns: [
                {
                    Name: 'Title', Label: 'Title', Sortable: true, Searchable: true, Filter: {
                        Name: '',
                        Text: 'Hola',
                        Argument: [],
                        Operator: 'Contains',
                        HasFilter: false
                    }
                },
                { Name: 'Author', Label: 'Author', Sortable: true, SortOrder: 2, SortDirection: 'Ascending', Searchable: true },
                { Name: 'Year', Label: 'Year', Sortable: true, Searchable: true }
            ]
        };

        let subset = Tubular.applyFreeTextSearch(request, queryBuilder);
        subset = Tubular.applyFiltering(request, subset);
        subset = Tubular.applySorting(request, subset);

        let expected = "select `Title`, `Author`, `Year` from `Books` where `Title` LIKE '%Hola%' order by `Author` asc";
        let result = subset.toString();

        expect(result).toBe(expected);
    });

    it(" sorts by two columns", function () {
        let queryBuilder = knex.select('Title', 'Author', 'Year').from('Books');

        let request = {
            Columns: [
                {
                    Name: 'Title', Label: 'Title', Sortable: true, Searchable: true, Filter: {
                        Name: '',
                        Text: 'Hola',
                        Argument: [],
                        Operator: 'Contains',
                        HasFilter: false
                    }
                },
                { Name: 'Author', Label: 'Author', Sortable: true, SortOrder: 3, SortDirection: 'Ascending', Searchable: true },
                { Name: 'Year', Label: 'Year', Sortable: true, SortOrder: 2, SortDirection: 'Descending', Searchable: true }
            ]
        };

        let subset = Tubular.applyFreeTextSearch(request, queryBuilder);
        subset = Tubular.applyFiltering(request, subset);
        subset = Tubular.applySorting(request, subset);

        let expected = "select `Title`, `Author`, `Year` from `Books` where `Title` LIKE '%Hola%' order by `Author` asc, `Year` desc";
        let result = subset.toString();

        expect(result).toBe(expected);
    });

    it(" use aggregate on one column", function () {
        let queryBuilder = knex.select('Title', 'Author', 'Year').from('Books');

        let request = {
            Columns: [
                {
                    Name: 'Title', Label: 'Title', Sortable: true, Searchable: true, Filter: {
                        Name: '',
                        Text: 'Hola',
                        Argument: [],
                        Operator: 'Contains',
                        HasFilter: false
                    }
                },
                { Name: 'Author', Label: 'Author', Sortable: true, SortOrder: 3, SortDirection: 'Ascending', Searchable: true, Aggregate: "Count" },
                { Name: 'Year', Label: 'Year', Sortable: true, SortOrder: 2, SortDirection: 'Descending', Searchable: true }
            ]
        };

        let subset = Tubular.applyFreeTextSearch(request, queryBuilder);
        subset = Tubular.applyFiltering(request, subset);
        // subset = Tubular.applySorting(request, subset);

        let expected = "select `Title`, `Author`, `Year` from `Books` where `Title` LIKE '%Hola%'";
        let result = subset.toString();
        expect(result).toBe(expected);

        let expectedAggregate = "select count(`Author`) from `Books` where `Title` LIKE '%Hola%'";
        let resultAggregate = Tubular.getAggregatePayloads(request, subset);

        expect(resultAggregate.Author).toBeDefined();
        expect(resultAggregate.Author.toString()).toBe(expectedAggregate);
    });

    it(" use aggregate on two columns", function () {
        let queryBuilder = knex.select('Title', 'Author', 'Year').from('Books');

        let request = {
            Columns: [
                {
                    Name: 'Title', Label: 'Title', Sortable: true, Searchable: true, Filter: {
                        Name: '',
                        Text: 'Hola',
                        Argument: [],
                        Operator: 'Contains',
                        HasFilter: false
                    }
                },
                { Name: 'Author', Label: 'Author', Sortable: true, SortOrder: 3, SortDirection: 'Ascending', Searchable: true, Aggregate: "Count" },
                { Name: 'Year', Label: 'Year', Sortable: true, SortOrder: 2, SortDirection: 'Descending', Searchable: true, Aggregate: "Sum" }
            ]
        };

        let subset = Tubular.applyFreeTextSearch(request, queryBuilder);
        subset = Tubular.applyFiltering(request, subset);
        // subset = Tubular.applySorting(request, subset);

        let expected = "select `Title`, `Author`, `Year` from `Books` where `Title` LIKE '%Hola%'";
        let result = subset.toString();
        expect(result).toBe(expected);

        let authorAggregate = "select count(`Author`) from `Books` where `Title` LIKE '%Hola%'";
        let yearAggregate = "select sum(`Year`) from `Books` where `Title` LIKE '%Hola%'";
        let resultAggregate = Tubular.getAggregatePayloads(request, subset);

        expect(resultAggregate.Author).toBeDefined();
        expect(resultAggregate.Author.toString()).toBe(authorAggregate);

        expect(resultAggregate.Year).toBeDefined();
        expect(resultAggregate.Year.toString()).toBe(yearAggregate);
    });

    it(" use all possible aggregates", function () {
        let queryBuilder = knex.select('Title', 'Author', 'Year').from('Books');

        let request = {
            Columns: [
                {
                    Name: 'Title', Label: 'Title', Sortable: true, Searchable: true, Filter: {
                        Name: '',
                        Text: 'Hola',
                        Argument: [],
                        Operator: 'Contains',
                        HasFilter: false
                    }
                },
                { Name: 'AverageColumn', Label: 'AverageColumn', Sortable: true, SortDirection: 'Descending', Searchable: true, Aggregate: "Average" },
                { Name: 'CountColumn', Label: 'CountColumn', Sortable: true, SortDirection: 'Ascending', Searchable: true, Aggregate: "Count" },
                { Name: 'SumColumn', Label: 'SumColumn', Sortable: true, SortDirection: 'Ascending', Searchable: true, Aggregate: "Sum" },
                { Name: 'MaxColumn', Label: 'MaxColumn', Sortable: true, SortDirection: 'Ascending', Searchable: true, Aggregate: "Max" },
                { Name: 'MinColumn', Label: 'MinColumn', Sortable: true, SortDirection: 'Ascending', Searchable: true, Aggregate: "Min" },
                { Name: 'DistinctCountColumn', Label: 'DistinctCountColumn', Sortable: true, SortDirection: 'Ascending', Searchable: true, Aggregate: "DistinctCount" }

            ]
        };

        let subset = Tubular.applyFreeTextSearch(request, queryBuilder);
        subset = Tubular.applyFiltering(request, subset);
        // subset = Tubular.applySorting(request, subset);

        let expected = "select `Title`, `Author`, `Year` from `Books` where `Title` LIKE '%Hola%'";
        let result = subset.toString();
        expect(result).toBe(expected);

        let avgAggregate = "select avg(`AverageColumn`) from `Books` where `Title` LIKE '%Hola%'";
        let countAggregate = "select count(`CountColumn`) from `Books` where `Title` LIKE '%Hola%'";
        let sumAggregate = "select sum(`SumColumn`) from `Books` where `Title` LIKE '%Hola%'";
        let maxAggregate = "select max(`MaxColumn`) from `Books` where `Title` LIKE '%Hola%'";
        let minAggregate = "select min(`MinColumn`) from `Books` where `Title` LIKE '%Hola%'";
        let distinctCountAggregate = "select count(distinct `DistinctCountColumn`) from `Books` where `Title` LIKE '%Hola%'";
        let resultAggregate = Tubular.getAggregatePayloads(request, subset);

        expect(resultAggregate.AverageColumn).toBeDefined();
        expect(resultAggregate.AverageColumn.toString()).toBe(avgAggregate);

        expect(resultAggregate.CountColumn).toBeDefined();
        expect(resultAggregate.CountColumn.toString()).toBe(countAggregate);

        expect(resultAggregate.SumColumn).toBeDefined();
        expect(resultAggregate.SumColumn.toString()).toBe(sumAggregate);

        expect(resultAggregate.MaxColumn).toBeDefined();
        expect(resultAggregate.MaxColumn.toString()).toBe(maxAggregate);

        expect(resultAggregate.MinColumn).toBeDefined();
        expect(resultAggregate.MinColumn.toString()).toBe(minAggregate);

        expect(resultAggregate.DistinctCountColumn).toBeDefined();
        expect(resultAggregate.DistinctCountColumn.toString()).toBe(distinctCountAggregate);
    });

});