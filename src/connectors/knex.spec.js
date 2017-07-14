var tubular = require('../tubular')('knex');
var GridDataRequest = require('../grid-data-request');
var CompareOperator = require('../compare-operator');
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
        it("skipping first 10 and taking 20", done => {
            const skip = 10,
                take = 20,
                filteredCount = 598;

            let queryBuilder = knex.select('first_name', 'last_name', 'address_id').from('customer');

            let request = new GridDataRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, Filter: {
                            Name: '',
                            Text: 'Patricia',
                            Argument: [],
                            Operator: CompareOperator.notEquals,
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

        it(" use free text search", done => {
            const skip = 0,
                take = 10,
                filteredCount = 31;

            let queryBuilder = knex.select('first_name', 'last_name', 'address_id').from('customer');

            let request = new GridDataRequest({
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
                    Operator: CompareOperator.auto,
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

        it(" filters by one column", done => {
            const skip = 0,
                take = 10,
                filteredCount = 1;

            let queryBuilder = knex.select('first_name', 'last_name', 'address_id').from('customer');


            let request = new GridDataRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, Filter: {
                            Name: '',
                            Text: 'JOY',
                            Argument: [],
                            Operator: CompareOperator.contains,
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
                    Operator: CompareOperator.auto,
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

        it(" combines search and filter", done => {
            const skip = 0,
                take = 10,
                filteredCount = 1;

            let queryBuilder = knex.select('first_name', 'last_name', 'address_id').from('customer');


            let request = new GridDataRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, Filter: {
                            Name: '',
                            Text: 'ANDREW',
                            Argument: [],
                            Operator: CompareOperator.equals,
                            HasFilter: false
                        }
                    },
                    {
                        Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true, Filter: {
                            Name: '',
                            Text: 'PURDY',
                            Argument: [],
                            Operator: CompareOperator.equals,
                            HasFilter: false
                        }
                    },
                    { Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false }
                ],
                Search: {
                    Name: '',
                    Text: 'AND',
                    Argument: [],
                    Operator: CompareOperator.auto,
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
        it("filters using Equals", done => {
            const skip = 0,
                take = 10,
                filteredCount = 1;

            let queryBuilder = knex.select('first_name', 'last_name', 'address_id').from('customer');

            let request = new GridDataRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, Filter: {
                            Name: '',
                            Text: 'Patricia',
                            Argument: [],
                            Operator: CompareOperator.equals,
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

        it("filters using NotEquals", done => {
            const skip = 0,
                take = 10,
                filteredCount = 598;

            let queryBuilder = knex.select('first_name', 'last_name', 'address_id').from('customer');

            let request = new GridDataRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, Filter: {
                            Name: '',
                            Text: 'Patricia',
                            Argument: [],
                            Operator: CompareOperator.notEquals,
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

        it("filters using Contains", done => {
            const skip = 0,
                take = 10,
                filteredCount = 5;

            let request = new GridDataRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, Filter: {
                            Name: '',
                            Text: 'ley',
                            Argument: [],
                            Operator: CompareOperator.contains,
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

        it("filters using NotContains", done => {
            const skip = 0,
                take = 10,
                filteredCount = 594;

            let request = new GridDataRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, Filter: {
                            Name: '',
                            Text: 'ley',
                            Argument: [],
                            Operator: CompareOperator.notContains,
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

        it("filters using StartsWith", done => {
            const skip = 0,
                take = 10,
                filteredCount = 5;

            let request = new GridDataRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, Filter: {
                            Name: '',
                            Text: 'na',
                            Argument: [],
                            Operator: CompareOperator.startsWith,
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

        it("filters using NotStartsWith", done => {
            const skip = 0,
                take = 10,
                filteredCount = 594;

            let request = new GridDataRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, Filter: {
                            Name: '',
                            Text: 'na',
                            Argument: [],
                            Operator: CompareOperator.notStartsWith,
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

        it("filters using EndsWith", done => {
            const skip = 0,
                take = 10,
                filteredCount = 8;

            let request = new GridDataRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, Filter: {
                            Name: '',
                            Text: 'rry',
                            Argument: [],
                            Operator: CompareOperator.endsWith,
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

        it("filters using NotEndsWith", done => {
            const skip = 0,
                take = 10,
                filteredCount = 591;

            let request = new GridDataRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, Filter: {
                            Name: '',
                            Text: 'rry',
                            Argument: [],
                            Operator: CompareOperator.notEndsWith,
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

        it("filters using Gte", done => {
            const skip = 0,
                take = 10,
                filteredCount = 2;

            let request = new GridDataRequest({
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
                            Operator: CompareOperator.gte,
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

        it("filters using Gt", done => {
            const skip = 0,
                take = 10,
                filteredCount = 1;

            let request = new GridDataRequest({
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
                            Operator: CompareOperator.gt,
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

        it("filters using Lte", done => {
            const skip = 0,
                take = 10,
                filteredCount = 2;

            let request = new GridDataRequest({
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
                            Operator: CompareOperator.lte,
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

        it("filters using Lt", done => {
            const skip = 0,
                take = 10,
                filteredCount = 1;

            let request = new GridDataRequest({
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
                            Operator: CompareOperator.lt,
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

        it("filters using Between", done => {
            const skip = 0,
                take = 10,
                filteredCount = 597;

            let request = new GridDataRequest({
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
                            Operator: CompareOperator.between,
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

        it("fails due to unknwon Compare Operator", () => {
            const skip = 0,
                take = 10,
                filteredCount = 48;

            let request = new GridDataRequest({
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
        it(" sorts by default column", done => {
            const skip = 0,
                take = 10,
                filteredCount = 599,
                totalRecordCount = 599;

            let queryBuilder = knex.select('first_name', 'last_name', 'address_id').from('customer');


            let request = new GridDataRequest({
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

        it(" sorts by specific column", done => {
            const skip = 0,
                take = 10,
                filteredCount = 599,
                totalRecordCount = 599;

            let queryBuilder = knex.select('first_name', 'last_name', 'address_id').from('customer');


            let request = new GridDataRequest({
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

        it(" sorts by TWO columns", done => {
            const skip = 0,
                take = 10,
                filteredCount = 599,
                totalRecordCount = 599;

            let queryBuilder = knex.select('first_name', 'last_name', 'active').from('customer');


            let request = new GridDataRequest({
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

        it("uses Count", done => {
            const skip = 0,
                take = 10,
                filteredCount = totalRecordCount;

            let request = new GridDataRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, Aggregate: 'Count'
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

        it("uses Distinct Count", done => {
            const skip = 0,
                take = 10,
                filteredCount = totalRecordCount;

            let request = new GridDataRequest({
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
                        Name: 'active', Label: 'Is Active', Sortable: true, Searchable: false, Aggregate: 'DistinctCount'
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

        it("uses Max", done => {
            const skip = 0,
                take = 10,
                filteredCount = totalRecordCount;

            let request = new GridDataRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, SortOrder: 2, SortDirection: 'Ascending'
                    },
                    {
                        Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true, SortOrder: 3, SortDirection: 'Ascending'
                    },
                    {
                        Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false, Aggregate: 'Max'
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

        it("uses Min", done => {
            const skip = 0,
                take = 10,
                filteredCount = totalRecordCount;

            let request = new GridDataRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, SortOrder: 2, SortDirection: 'Ascending'
                    },
                    {
                        Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true, SortOrder: 3, SortDirection: 'Ascending'
                    },
                    {
                        Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false, Aggregate: 'Min'
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

        it("uses Average", done => {
            const skip = 0,
                take = 10,
                filteredCount = totalRecordCount;

            let request = new GridDataRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, SortOrder: 2, SortDirection: 'Ascending'
                    },
                    {
                        Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true, SortOrder: 3, SortDirection: 'Ascending'
                    },
                    {
                        Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false
                    },
                    {
                        Name: 'customer_id', Label: 'Customer Id', Sortable: true, Searchable: false, Aggregate: 'Average'
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

        it("uses Sum", done => {
            const skip = 0,
                take = 10,
                filteredCount = totalRecordCount;

            let request = new GridDataRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, SortOrder: 2, SortDirection: 'Ascending'
                    },
                    {
                        Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true, SortOrder: 3, SortDirection: 'Ascending'
                    },
                    {
                        Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false, Aggregate: 'Sum'
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

        it("fails due to unknwon aggregate", () => {
            const skip = 0,
                take = 10;

            let request = new GridDataRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, SortOrder: 2, SortDirection: 'Ascending'
                    },
                    {
                        Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true, SortOrder: 3, SortDirection: 'Ascending'
                    },
                    {
                        Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false, Aggregate: 'Unknown'
                    }
                ]
            });

            let queryBuilder = knex.select('first_name', 'last_name', 'address_id', 'customer_id').from('customer');

            expect(() => tubular.createGridResponse(request, queryBuilder)).toThrow("Unsupported aggregate function");
        });

        it(" aggregate on one column", done => {
            const skip = 0,
                take = 10,
                filteredCount = 32,
                totalRecordCount = 16049;

            let queryBuilder = knex.select('customer_id', 'amount', 'payment_id').from('payment');


            let request = new GridDataRequest({
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

        it(" aggregate on two columns", done => {
            const skip = 0,
                take = 10,
                filteredCount = 32,
                totalRecordCount = 16049;

            let queryBuilder = knex.select('customer_id', 'amount', 'payment_id').from('payment');

            let request = new GridDataRequest({
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