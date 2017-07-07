var tubular = require('../tubular')('knex');
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

describe("knex connector", function () {
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
                expect(response.TotalRecordCount).toBe(totalRecordCount);
                expect(response.FilteredRecordCount).toBe(filteredCount);
                expect(response.TotalPages).toBe(Math.ceil(filteredCount / take));
                expect(response.Payload.length).toBe(take);
                done();
            });
    });

    it(" filters by one column", done => {
        const skip = 0,
            take = 10,
            filteredCount = 1,
            totalRecordCount = 599;

        let queryBuilder = knex.select('first_name', 'last_name', 'address_id').from('customer');


        let request = {
            Skip: skip,
            Take: take,
            Counter: 1,
            Columns: [
                {
                    Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, Filter: {
                        Name: '',
                        Text: 'JOY',
                        Argument: [],
                        Operator: 'Contains',
                        HasFilter: false
                    }
                },
                { Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true },
                { Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false }
            ],
            Search: {
                Name: '',
                Text: 'GEO',
                Argument: [],
                Operator: 'Auto',
                HasFilter: false
            }
        };

        tubular.createGridResponse(request, queryBuilder)
            .then(response => {
                expect(response.Counter).toBeDefined();
                expect(response.TotalRecordCount).toBe(totalRecordCount);
                expect(response.FilteredRecordCount).toBe(filteredCount);
                expect(response.TotalPages).toBe(Math.ceil(filteredCount / take));
                expect(response.Payload.length).toBe(1);
                done();
            });
    });

    it(" combines search and filter", done => {
        const skip = 0,
            take = 10,
            filteredCount = 1,
            totalRecordCount = 599;

        let queryBuilder = knex.select('first_name', 'last_name', 'address_id').from('customer');


        let request = {
            Skip: skip,
            Take: take,
            Counter: 1,
            Columns: [
                {
                    Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, Filter: {
                        Name: '',
                        Text: 'ANDREW',
                        Argument: [],
                        Operator: 'Equals',
                        HasFilter: false
                    }
                },
                {
                    Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true, Filter: {
                        Name: '',
                        Text: 'PURDY',
                        Argument: [],
                        Operator: 'Equals',
                        HasFilter: false
                    }
                },
                { Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false }
            ],
            Search: {
                Name: '',
                Text: 'AND',
                Argument: [],
                Operator: 'Auto',
                HasFilter: false
            }
        };

        tubular.createGridResponse(request, queryBuilder)
            .then(response => {
                expect(response.Counter).toBeDefined();
                expect(response.TotalRecordCount).toBe(totalRecordCount);
                expect(response.FilteredRecordCount).toBe(filteredCount);
                expect(response.TotalPages).toBe(Math.ceil(filteredCount / take));
                expect(response.Payload.length).toBe(1);
                done();
            });
    });

    it(" sorts by default column", done => {
        const skip = 0,
            take = 10,
            filteredCount = 599,
            totalRecordCount = 599;

        let queryBuilder = knex.select('first_name', 'last_name', 'address_id').from('customer');


        let request = {
            Skip: skip,
            Take: take,
            Counter: 1,
            Columns: [
                {
                    Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true
                },
                {
                    Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true
                },
                {
                    Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false
                }
            ]
        };

        tubular.createGridResponse(request, queryBuilder)
            .then(response => {
                expect(response.Counter).toBeDefined();
                expect(response.TotalRecordCount).toBe(totalRecordCount);
                expect(response.FilteredRecordCount).toBe(filteredCount);
                expect(response.TotalPages).toBe(Math.ceil(filteredCount / take));
                expect(response.Payload.length).toBe(take);
                expect(response.Payload[0][0]).toBe('AARON');
                done();
            });
    });

    it(" sorts by specific column", done => {
        const skip = 0,
            take = 10,
            filteredCount = 599,
            totalRecordCount = 599;

        let queryBuilder = knex.select('first_name', 'last_name', 'address_id').from('customer');


        let request = {
            Skip: skip,
            Take: take,
            Counter: 1,
            Columns: [
                {
                    Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true
                },
                {
                    Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true, SortOrder: 2, SortDirection: 'Ascending'
                },
                {
                    Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false
                }
            ]
        };

        tubular.createGridResponse(request, queryBuilder)
            .then(response => {
                expect(response.Counter).toBeDefined();
                expect(response.TotalRecordCount).toBe(totalRecordCount);
                expect(response.FilteredRecordCount).toBe(filteredCount);
                expect(response.TotalPages).toBe(Math.ceil(filteredCount / take));
                expect(response.Payload.length).toBe(take);
                expect(response.Payload[0][1]).toBe('ABNEY');
                done();
            });
    });

    it(" sorts by TWO columns", done => {
        const skip = 0,
            take = 10,
            filteredCount = 599,
            totalRecordCount = 599;

        let queryBuilder = knex.select('first_name', 'last_name', 'active').from('customer');


        let request = {
            Skip: skip,
            Take: take,
            Counter: 1,
            Columns: [
                {
                    Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true
                },
                {
                    Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true, SortOrder: 2, SortDirection: 'Ascending'
                },
                {
                    Name: 'active', Label: 'Is Active', Sortable: true, Searchable: false, SortOrder: 3, SortDirection: 'Ascending'
                }
            ]
        };

        tubular.createGridResponse(request, queryBuilder)
            .then(response => {
                expect(response.Counter).toBeDefined();
                expect(response.TotalRecordCount).toBe(totalRecordCount);
                expect(response.FilteredRecordCount).toBe(filteredCount);
                expect(response.TotalPages).toBe(Math.ceil(filteredCount / take));
                expect(response.Payload.length).toBe(take);
                expect(response.Payload[0][2]).toBe(0);
                expect(response.Payload[0][1]).toBe('ARCE');
                done();
            });
    });

    it(" aggregate on one column", done => {
        const skip = 0,
            take = 10,
            filteredCount = 32,
            totalRecordCount = 16049;

        let queryBuilder = knex.select('customer_id', 'amount', 'payment_id').from('payment');


        let request = {
            Skip: skip,
            Take: take,
            Counter: 1,
            Columns: [
                {
                    Name: 'customer_id', Label: 'Customer Id', Sortable: true, Searchable: true, Filter: {
                        Name: '',
                        Text: 1,
                        Argument: [],
                        Operator: 'Equals',
                        HasFilter: false
                    }
                },
                {
                    Name: 'amount', Label: 'Amount', Sortable: true, Searchable: true, Aggregate: 'Sum'
                },
                {
                    Name: 'payment_id', Label: 'Payment Id', Sortable: true, Searchable: false
                }
            ]
        };

        tubular.createGridResponse(request, queryBuilder)
            .then(response => {

                expect(response.Counter).toBeDefined();
                expect(response.TotalRecordCount).toBe(totalRecordCount);
                expect(response.FilteredRecordCount).toBe(filteredCount);
                expect(response.TotalPages).toBe(Math.ceil(filteredCount / take));
                expect(response.Payload.length).toBe(take);
                expect(response.AggregationPayload).toBeDefined();
                expect(response.AggregationPayload.amount).toBeDefined(0);
                expect(response.AggregationPayload.amount).toBeGreaterThan(0);
                
                done();
            });
    });

    it(" aggregate on two columns", done => {
        const skip = 0,
            take = 10,
            filteredCount = 32,
            totalRecordCount = 16049;

        let queryBuilder = knex.select('customer_id', 'amount', 'payment_id').from('payment');

        let request = {
            Skip: skip,
            Take: take,
            Counter: 1,
            Columns: [
                {
                    Name: 'customer_id', Label: 'Customer Id', Sortable: true, Searchable: true, Filter: {
                        Name: '',
                        Text: 1,
                        Argument: [],
                        Operator: 'Equals',
                        HasFilter: false
                    }
                },
                {
                    Name: 'amount', Label: 'Amount', Sortable: true, Searchable: true, Aggregate: 'Sum'
                },
                {
                    Name: 'payment_id', Label: 'Payment Id', Sortable: true, Searchable: false, Aggregate: 'Count'
                }
            ]
        };

        tubular.createGridResponse(request, queryBuilder)
            .then(response => {

                expect(response.Counter).toBeDefined();
                expect(response.TotalRecordCount).toBe(totalRecordCount);
                expect(response.FilteredRecordCount).toBe(filteredCount);
                expect(response.TotalPages).toBe(Math.ceil(filteredCount / take));
                expect(response.Payload.length).toBe(take);
                expect(response.AggregationPayload).toBeDefined();
                expect(response.AggregationPayload.amount).toBeDefined(0);
                expect(response.AggregationPayload.amount).toBeGreaterThan(0);
                expect(response.AggregationPayload.payment_id).toBeDefined(0);
                expect(response.AggregationPayload.payment_id).toBeGreaterThan(0);
                
                done();
            });
    });

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