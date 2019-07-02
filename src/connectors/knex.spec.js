var tubular = require('../tubular')('knex');
var {GridRequest} = require('tubular-common');
var {CompareOperators} = require('tubular-common');
var {AggregateFunctions} = require('tubular-common');
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

var totalRecordCount = 599;

describe("knex connector", function () {

    describe("Paging", function () {
        xit("skipping first 10 and taking 20", done => {
            const skip = 10,
                take = 20,
                filteredCount = 598;

            let queryBuilder = knex.select('first_name', 'last_name', 'address_id').from('customer');

            let request = new GridRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, Filter: {
                            Name: '',
                            Text: 'Patricia',
                            Argument: [],
                            Operator: CompareOperators.NOT_EQUALS,
                            HasFilter: false
                        }
                    },
                    { Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true },
                    { Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false }
                ]
            });

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
    })

    describe("Search and Filter", function () {

        xit(" use free text search", done => {
            const skip = 0,
                take = 10,
                filteredCount = 31;

            let queryBuilder = knex.select('first_name', 'last_name', 'address_id').from('customer');

            let request = new GridRequest({
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
                    Operator: CompareOperators.AUTO,
                    HasFilter: false
                }
            });

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

        xit(" filters by one column", done => {
            const skip = 0,
                take = 10,
                filteredCount = 1;

            let queryBuilder = knex.select('first_name', 'last_name', 'address_id').from('customer');


            let request = new GridRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, Filter: {
                            Name: '',
                            Text: 'JOY',
                            Argument: [],
                            Operator: CompareOperators.CONTAINS,
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
                    Operator: CompareOperators.AUTO,
                    HasFilter: false
                }
            });

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

        xit(" combines search and filter", done => {
            const skip = 0,
                take = 10,
                filteredCount = 1;

            let queryBuilder = knex.select('first_name', 'last_name', 'address_id').from('customer');


            let request = new GridRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, Filter: {
                            Name: '',
                            Text: 'ANDREW',
                            Argument: [],
                            Operator: CompareOperators.EQUALS,
                            HasFilter: false
                        }
                    },
                    {
                        Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true, Filter: {
                            Name: '',
                            Text: 'PURDY',
                            Argument: [],
                            Operator: CompareOperators.EQUALS,
                            HasFilter: false
                        }
                    },
                    { Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false }
                ],
                Search: {
                    Name: '',
                    Text: 'AND',
                    Argument: [],
                    Operator: CompareOperators.AUTO,
                    HasFilter: false
                }
            });

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
    });

    describe("Filter", function () {
        xit("filters using Equals", done => {
            const skip = 0,
                take = 10,
                filteredCount = 1;

            let queryBuilder = knex.select('first_name', 'last_name', 'address_id').from('customer');

            let request = new GridRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, Filter: {
                            Name: '',
                            Text: 'Patricia',
                            Argument: [],
                            Operator: CompareOperators.EQUALS,
                            HasFilter: false
                        }
                    },
                    { Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true },
                    { Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false }
                ]
            });

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

        xit("filters using NotEquals", done => {
            const skip = 0,
                take = 10,
                filteredCount = 598;

            let queryBuilder = knex.select('first_name', 'last_name', 'address_id').from('customer');

            let request = new GridRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, Filter: {
                            Name: '',
                            Text: 'Patricia',
                            Argument: [],
                            Operator: CompareOperators.NOT_EQUALS,
                            HasFilter: false
                        }
                    },
                    { Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true },
                    { Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false }
                ]
            });

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

        xit("filters using Contains", done => {
            const skip = 0,
                take = 10,
                filteredCount = 5;

            let request = new GridRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, Filter: {
                            Name: '',
                            Text: 'ley',
                            Argument: [],
                            Operator: CompareOperators.CONTAINS,
                            HasFilter: false
                        }
                    },
                    { Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true },
                    { Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false }
                ]
            });

            let queryBuilder = knex.select('first_name', 'last_name', 'address_id').from('customer');

            tubular.createGridResponse(request, queryBuilder)
                .then(response => {
                    expect(response.Counter).toBeDefined();
                    expect(response.TotalRecordCount).toBe(totalRecordCount);
                    expect(response.FilteredRecordCount).toBe(filteredCount);
                    expect(response.TotalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.Payload.length).toBe(filteredCount);
                    done();
                });
        });

        xit("filters using NotContains", done => {
            const skip = 0,
                take = 10,
                filteredCount = 594;

            let request = new GridRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, Filter: {
                            Name: '',
                            Text: 'ley',
                            Argument: [],
                            Operator: CompareOperators.NOT_CONTAINS,
                            HasFilter: false
                        }
                    },
                    { Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true },
                    { Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false }
                ]
            });

            let queryBuilder = knex.select('first_name', 'last_name', 'address_id').from('customer');

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

        xit("filters using StartsWith", done => {
            const skip = 0,
                take = 10,
                filteredCount = 5;

            let request = new GridRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, Filter: {
                            Name: '',
                            Text: 'na',
                            Argument: [],
                            Operator: CompareOperators.STARTS_WITH,
                            HasFilter: false
                        }
                    },
                    { Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true },
                    { Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false }
                ]
            });

            let queryBuilder = knex.select('first_name', 'last_name', 'address_id').from('customer');

            tubular.createGridResponse(request, queryBuilder)
                .then(response => {
                    expect(response.Counter).toBeDefined();
                    expect(response.TotalRecordCount).toBe(totalRecordCount);
                    expect(response.FilteredRecordCount).toBe(filteredCount);
                    expect(response.TotalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.Payload.length).toBe(filteredCount);
                    done();
                });
        });

        xit("filters using NotStartsWith", done => {
            const skip = 0,
                take = 10,
                filteredCount = 594;

            let request = new GridRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, Filter: {
                            Name: '',
                            Text: 'na',
                            Argument: [],
                            Operator: CompareOperators.NOT_STARTS_WITH,
                            HasFilter: false
                        }
                    },
                    { Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true },
                    { Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false }
                ]
            });

            let queryBuilder = knex.select('first_name', 'last_name', 'address_id').from('customer');

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

        xit("filters using EndsWith", done => {
            const skip = 0,
                take = 10,
                filteredCount = 8;

            let request = new GridRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, Filter: {
                            Name: '',
                            Text: 'rry',
                            Argument: [],
                            Operator: CompareOperators.ENDS_WITH,
                            HasFilter: false
                        }
                    },
                    { Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true },
                    { Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false }
                ]
            });

            let queryBuilder = knex.select('first_name', 'last_name', 'address_id').from('customer');

            tubular.createGridResponse(request, queryBuilder)
                .then(response => {
                    expect(response.Counter).toBeDefined();
                    expect(response.TotalRecordCount).toBe(totalRecordCount);
                    expect(response.FilteredRecordCount).toBe(filteredCount);
                    expect(response.TotalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.Payload.length).toBe(filteredCount);
                    done();
                });
        });

        xit("filters using NotEndsWith", done => {
            const skip = 0,
                take = 10,
                filteredCount = 591;

            let request = new GridRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, Filter: {
                            Name: '',
                            Text: 'rry',
                            Argument: [],
                            Operator: CompareOperators.NOT_ENDS_WITH,
                            HasFilter: false
                        }
                    },
                    { Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true },
                    { Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false }
                ]
            });

            let queryBuilder = knex.select('first_name', 'last_name', 'address_id').from('customer');

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

        xit("filters using Gte", done => {
            const skip = 0,
                take = 10,
                filteredCount = 2;

            let request = new GridRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
                    { Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true },
                    { Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true },
                    {
                        Name: 'customer_id', Label: 'Customer Id', Sortable: true, Searchable: false, Filter: {
                            Name: '',
                            Text: 598,
                            Argument: [],
                            Operator: CompareOperators.GTE,
                            HasFilter: false
                        }
                    }
                ]
            });

            let queryBuilder = knex.select('first_name', 'last_name', 'customer_id').from('customer');

            tubular.createGridResponse(request, queryBuilder)
                .then(response => {
                    expect(response.Counter).toBeDefined();
                    expect(response.TotalRecordCount).toBe(totalRecordCount);
                    expect(response.FilteredRecordCount).toBe(filteredCount);
                    expect(response.TotalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.Payload.length).toBe(filteredCount);
                    done();
                });
        });

        xit("filters using Gt", done => {
            const skip = 0,
                take = 10,
                filteredCount = 1;

            let request = new GridRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
                    { Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true },
                    { Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true },
                    {
                        Name: 'customer_id', Label: 'Customer Id', Sortable: true, Searchable: false, Filter: {
                            Name: '',
                            Text: 598,
                            Argument: [],
                            Operator: CompareOperators.GT,
                            HasFilter: false
                        }
                    }
                ]
            });

            let queryBuilder = knex.select('first_name', 'last_name', 'customer_id').from('customer');

            tubular.createGridResponse(request, queryBuilder)
                .then(response => {
                    expect(response.Counter).toBeDefined();
                    expect(response.TotalRecordCount).toBe(totalRecordCount);
                    expect(response.FilteredRecordCount).toBe(filteredCount);
                    expect(response.TotalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.Payload.length).toBe(filteredCount);
                    done();
                });
        });

        xit("filters using Lte", done => {
            const skip = 0,
                take = 10,
                filteredCount = 2;

            let request = new GridRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
                    { Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true },
                    { Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true },
                    {
                        Name: 'customer_id', Label: 'Customer Id', Sortable: true, Searchable: false, Filter: {
                            Name: '',
                            Text: 2,
                            Argument: [],
                            Operator: CompareOperators.LTE,
                            HasFilter: false
                        }
                    }
                ]
            });

            let queryBuilder = knex.select('first_name', 'last_name', 'customer_id').from('customer');

            tubular.createGridResponse(request, queryBuilder)
                .then(response => {
                    expect(response.Counter).toBeDefined();
                    expect(response.TotalRecordCount).toBe(totalRecordCount);
                    expect(response.FilteredRecordCount).toBe(filteredCount);
                    expect(response.TotalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.Payload.length).toBe(filteredCount);
                    done();
                });
        });

        xit("filters using Lt", done => {
            const skip = 0,
                take = 10,
                filteredCount = 1;

            let request = new GridRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
                    { Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true },
                    { Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true },
                    {
                        Name: 'customer_id', Label: 'Customer Id', Sortable: true, Searchable: false, Filter: {
                            Name: '',
                            Text: 2,
                            Argument: [],
                            Operator: CompareOperators.LT,
                            HasFilter: false
                        }
                    }
                ]
            });

            let queryBuilder = knex.select('first_name', 'last_name', 'customer_id').from('customer');

            tubular.createGridResponse(request, queryBuilder)
                .then(response => {
                    expect(response.Counter).toBeDefined();
                    expect(response.TotalRecordCount).toBe(totalRecordCount);
                    expect(response.FilteredRecordCount).toBe(filteredCount);
                    expect(response.TotalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.Payload.length).toBe(filteredCount);
                    done();
                });
        });

        xit("filters using Between", done => {
            const skip = 0,
                take = 10,
                filteredCount = 597;

            let request = new GridRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
                    { Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true },
                    { Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true },
                    {
                        Name: 'customer_id', Label: 'Customer Id', Sortable: true, Searchable: false, Filter: {
                            Name: '',
                            Text: 2,
                            Argument: [598],
                            Operator: CompareOperators.BETWEEN,
                            HasFilter: false
                        }
                    }
                ]
            });

            let queryBuilder = knex.select('first_name', 'last_name', 'customer_id').from('customer');

            tubular.createGridResponse(request, queryBuilder)
                .then(response => {
                    expect(response.Counter).toBeDefined();
                    expect(response.TotalRecordCount).toBe(totalRecordCount);
                    expect(response.FilteredRecordCount).toBe(filteredCount);
                    expect(response.TotalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.Payload.length).toBe(10);
                    done();
                });
        });

        xit("fails due to unknwon Compare Operator", () => {
            const skip = 0,
                take = 10,
                filteredCount = 48;

            let request = new GridRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
                    { Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true },
                    { Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true },
                    {
                        Name: 'customer_id', Label: 'Customer Id', Sortable: true, Searchable: false, Filter: {
                            Name: '',
                            Text: 2,
                            Argument: [598],
                            Operator: 'Unknown',
                            HasFilter: false
                        }
                    }
                ]
            });

            let queryBuilder = knex.select('first_name', 'last_name', 'customer_id').from('customer');

            expect(() => tubular.createGridResponse(request, queryBuilder)).toThrow("Unsupported Compare Operator");
        });
    });

    describe("Sort", function () {
        xit(" sorts by default column", done => {
            const skip = 0,
                take = 10,
                filteredCount = 599,
                totalRecordCount = 599;

            let queryBuilder = knex.select('first_name', 'last_name', 'address_id').from('customer');


            let request = new GridRequest({
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
            });

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

        xit(" sorts by specific column", done => {
            const skip = 0,
                take = 10,
                filteredCount = 599,
                totalRecordCount = 599;

            let queryBuilder = knex.select('first_name', 'last_name', 'address_id').from('customer');


            let request = new GridRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true
                    },
                    {
                        Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true, SortOrder: 2, ColumnSortDirection: 'Ascending'
                    },
                    {
                        Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false
                    }
                ]
            });

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

        xit(" sorts by TWO columns", done => {
            const skip = 0,
                take = 10,
                filteredCount = 599,
                totalRecordCount = 599;

            let queryBuilder = knex.select('first_name', 'last_name', 'active').from('customer');


            let request = new GridRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true
                    },
                    {
                        Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true, SortOrder: 2, ColumnSortDirection: 'Ascending'
                    },
                    {
                        Name: 'active', Label: 'Is Active', Sortable: true, Searchable: false, SortOrder: 3, ColumnSortDirection: 'Ascending'
                    }
                ]
            });

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
    });

    describe("Aggregate", function () {

        xit("uses Count", done => {
            const skip = 0,
                take = 10,
                filteredCount = totalRecordCount;

            let request = new GridRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, Aggregate: AggregateFunctions.COUNT
                    },
                    {
                        Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true
                    },
                    {
                        Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false
                    }
                ]
            });

            let queryBuilder = knex.select('first_name', 'last_name', 'address_id').from('customer');

            tubular.createGridResponse(request, queryBuilder)
                .then(response => {
                    expect(response.Counter).toBeDefined();
                    expect(response.TotalRecordCount).toBe(totalRecordCount);
                    expect(response.FilteredRecordCount).toBe(filteredCount);
                    expect(response.TotalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.Payload.length).toBe(take);
                    expect(response.AggregationPayload).toBeDefined();
                    expect(response.AggregationPayload.first_name).toBe(totalRecordCount);

                    done();
                });
        });

        xit("uses Distinct Count", done => {
            const skip = 0,
                take = 10,
                filteredCount = totalRecordCount;

            let request = new GridRequest({
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
                        Name: 'active', Label: 'Is Active', Sortable: true, Searchable: false, Aggregate: AggregateFunctions.DISTINCT_COUNT
                    }
                ]
            });

            let queryBuilder = knex.select('first_name', 'last_name', 'active').from('customer');

            tubular.createGridResponse(request, queryBuilder)
                .then(response => {

                    expect(response.Counter).toBeDefined();
                    expect(response.TotalRecordCount).toBe(totalRecordCount);
                    expect(response.FilteredRecordCount).toBe(filteredCount);
                    expect(response.TotalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.Payload.length).toBe(take);
                    expect(response.AggregationPayload).toBeDefined();
                    expect(response.AggregationPayload.active).toBe(2);

                    done();
                });
        });

        xit("uses Max", done => {
            const skip = 0,
                take = 10,
                filteredCount = totalRecordCount;

            let request = new GridRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, SortOrder: 2, ColumnSortDirection: 'Ascending'
                    },
                    {
                        Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true, SortOrder: 3, ColumnSortDirection: 'Ascending'
                    },
                    {
                        Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false, Aggregate: AggregateFunctions.MAX
                    }
                ]
            });

            let queryBuilder = knex.select('first_name', 'last_name', 'address_id').from('customer');

            tubular.createGridResponse(request, queryBuilder)
                .then(response => {
                    expect(response.Counter).toBeDefined();
                    expect(response.TotalRecordCount).toBe(totalRecordCount);
                    expect(response.FilteredRecordCount).toBe(filteredCount);
                    expect(response.TotalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.Payload.length).toBe(take);
                    expect(response.AggregationPayload).toBeDefined();
                    expect(response.AggregationPayload.address_id).toBe(605);

                    done();
                });
        });

        xit("uses Min", done => {
            const skip = 0,
                take = 10,
                filteredCount = totalRecordCount;

            let request = new GridRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, SortOrder: 2, ColumnSortDirection: 'Ascending'
                    },
                    {
                        Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true, SortOrder: 3, ColumnSortDirection: 'Ascending'
                    },
                    {
                        Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false, Aggregate: AggregateFunctions.MIN
                    }
                ]
            });

            let queryBuilder = knex.select('first_name', 'last_name', 'address_id').from('customer');

            tubular.createGridResponse(request, queryBuilder)
                .then(response => {
                    expect(response.Counter).toBeDefined();
                    expect(response.TotalRecordCount).toBe(totalRecordCount);
                    expect(response.FilteredRecordCount).toBe(filteredCount);
                    expect(response.TotalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.Payload.length).toBe(take);
                    expect(response.AggregationPayload).toBeDefined();
                    expect(response.AggregationPayload.address_id).toBe(5);

                    done();
                });
        });

        xit("uses Average", done => {
            const skip = 0,
                take = 10,
                filteredCount = totalRecordCount;

            let request = new GridRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, SortOrder: 2, ColumnSortDirection: 'Ascending'
                    },
                    {
                        Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true, SortOrder: 3, ColumnSortDirection: 'Ascending'
                    },
                    {
                        Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false
                    },
                    {
                        Name: 'customer_id', Label: 'Customer Id', Sortable: true, Searchable: false, Aggregate: AggregateFunctions.AVERAGE
                    }
                ]
            });

            let queryBuilder = knex.select('first_name', 'last_name', 'address_id', 'customer_id').from('customer');

            tubular.createGridResponse(request, queryBuilder)
                .then(response => {
                    expect(response.Counter).toBeDefined();
                    expect(response.TotalRecordCount).toBe(totalRecordCount);
                    expect(response.FilteredRecordCount).toBe(filteredCount);
                    expect(response.TotalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.Payload.length).toBe(take);
                    expect(response.AggregationPayload).toBeDefined();
                    expect(Math.round(response.AggregationPayload.customer_id)).toBe(300);

                    done();
                });
        });

        xit("uses Sum", done => {
            const skip = 0,
                take = 10,
                filteredCount = totalRecordCount;

            let request = new GridRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, SortOrder: 2, ColumnSortDirection: 'Ascending'
                    },
                    {
                        Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true, SortOrder: 3, ColumnSortDirection: 'Ascending'
                    },
                    {
                        Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false, Aggregate: AggregateFunctions.SUM
                    }
                ]
            });

            let queryBuilder = knex.select('first_name', 'last_name', 'address_id', 'customer_id').from('customer');

            tubular.createGridResponse(request, queryBuilder)
                .then(response => {
                    expect(response.Counter).toBeDefined();
                    expect(response.TotalRecordCount).toBe(totalRecordCount);
                    expect(response.FilteredRecordCount).toBe(filteredCount);
                    expect(response.TotalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.Payload.length).toBe(take);
                    expect(response.AggregationPayload).toBeDefined();
                    expect(response.AggregationPayload.address_id).toBe(182530);

                    done();
                });
        });

        xit("fails due to unknwon aggregate", () => {
            const skip = 0,
                take = 10;

            let request = new GridRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, SortOrder: 2, ColumnSortDirection: 'Ascending'
                    },
                    {
                        Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true, SortOrder: 3, ColumnSortDirection: 'Ascending'
                    },
                    {
                        Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false, Aggregate: 'Unknown'
                    }
                ]
            });

            let queryBuilder = knex.select('first_name', 'last_name', 'address_id', 'customer_id').from('customer');

            expect(() => tubular.createGridResponse(request, queryBuilder)).toThrow("Unsupported aggregate function");
        });

        xit(" aggregate on one column", done => {
            const skip = 0,
                take = 10,
                filteredCount = 32,
                totalRecordCount = 16049;

            let queryBuilder = knex.select('customer_id', 'amount', 'payment_id').from('payment');


            let request = new GridRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
                    {
                        Name: 'customer_id', Label: 'Customer Id', Sortable: true, Searchable: true, Filter: {
                            Name: '',
                            Text: 1,
                            Argument: [],
                            Operator: CompareOperators.EQUALS,
                            HasFilter: false
                        }
                    },
                    {
                        Name: 'amount', Label: 'Amount', Sortable: true, Searchable: true, Aggregate: AggregateFunctions.SUM
                    },
                    {
                        Name: 'payment_id', Label: 'Payment Id', Sortable: true, Searchable: false
                    }
                ]
            });

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

        xit(" aggregate on two columns", done => {
            const skip = 0,
                take = 10,
                filteredCount = 32,
                totalRecordCount = 16049;

            let queryBuilder = knex.select('customer_id', 'amount', 'payment_id').from('payment');

            let request = new GridRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
                    {
                        Name: 'customer_id', Label: 'Customer Id', Sortable: true, Searchable: true, Filter: {
                            Name: '',
                            Text: 1,
                            Argument: [],
                            Operator: CompareOperators.EQUALS,
                            HasFilter: false
                        }
                    },
                    {
                        Name: 'amount', Label: 'Amount', Sortable: true, Searchable: true, Aggregate: AggregateFunctions.SUM
                    },
                    {
                        Name: 'payment_id', Label: 'Payment Id', Sortable: true, Searchable: false, Aggregate: AggregateFunctions.COUNT
                    }
                ]
            });

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
    });

});