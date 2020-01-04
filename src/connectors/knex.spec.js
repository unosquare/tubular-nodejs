var tubular = require('../tubular')('knex');
var { GridRequest } = require('tubular-common');
var { CompareOperators } = require('tubular-common');
var { AggregateFunctions } = require('tubular-common');
var knex = require('knex')({
    client: 'mysql',
    connection: {
        host: 'localhost',
        user: 'root',
        port: 3306,
        password: 'root',
        database: 'sakila'
    }
});

var totalRecordCount = 599;

describe("knex connector", function () {
    afterAll((done) => {
        knex.destroy().then(function () {
            done();
        });
    });

    describe("Paging", function () {
        it("skipping first 10 and taking 20", done => {
            const take = 20,
                filteredCount = 598;

            let queryBuilder = knex.select('first_name', 'last_name', 'address_id').from('customer');

            let request = new GridRequest(
                [
                    {
                        name: 'first_name', label: 'First Name', sortable: true, searchable: true, filter: {
                            name: '',
                            text: 'Patricia',
                            argument: [],
                            operator: CompareOperators.NotEquals,
                            hasFilter: false
                        }
                    },
                    { name: 'last_name', label: 'Last Name', sortable: true, searchable: true },
                    { name: 'address_id', label: 'Address Id', sortable: true, searchable: false }
                ],
                take,
                0,
            );

            tubular.createGridResponse(request, queryBuilder)
                .then(response => {
                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(take);
                    done();
                });
        });
    })

    describe("Search and Filter", function () {

        it(" use free text search", done => {
            const take = 10,
                filteredCount = 31;

            let queryBuilder = knex.select('first_name', 'last_name', 'address_id').from('customer');

            let request = new GridRequest(
                [
                    { name: 'first_name', label: 'First Name', sortable: true, searchable: true },
                    { name: 'last_name', label: 'Last Name', sortable: true, searchable: true },
                    { name: 'address_id', label: 'Address Id', sortable: true, searchable: false }
                ],
                take,
                0,
                'And',
            );

            tubular.createGridResponse(request, queryBuilder)
                .then(response => {
                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(take);
                    done();
                });
        });

        it(" filters by one column", done => {
            const take = 10,
                filteredCount = 1;

            let queryBuilder = knex.select('first_name', 'last_name', 'address_id').from('customer');


            let request = new GridRequest(
                [
                    {
                        name: 'first_name', label: 'First Name', sortable: true, searchable: true, filter: {
                            name: '',
                            text: 'JOY',
                            argument: [],
                            operator: CompareOperators.Contains,
                            hasFilter: false
                        }
                    },
                    { name: 'last_name', label: 'Last Name', sortable: true, searchable: true },
                    { name: 'address_id', label: 'Address Id', sortable: true, searchable: false }
                ],
                take,
                0,
                'GEO'
            );

            tubular.createGridResponse(request, queryBuilder)
                .then(response => {
                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(1);
                    done();
                });
        });

        it(" combines search and filter", done => {
            const take = 10,
                filteredCount = 1;

            let queryBuilder = knex.select('first_name', 'last_name', 'address_id').from('customer');


            let request = new GridRequest(
                [
                    {
                        name: 'first_name', label: 'First Name', sortable: true, searchable: true, filter: {
                            name: '',
                            text: 'ANDREW',
                            argument: [],
                            operator: CompareOperators.Equals,
                            hasFilter: false
                        }
                    },
                    {
                        name: 'last_name', label: 'Last Name', sortable: true, searchable: true, filter: {
                            name: '',
                            text: 'PURDY',
                            argument: [],
                            operator: CompareOperators.Equals,
                            hasFilter: false
                        }
                    },
                    { name: 'address_id', label: 'Address Id', sortable: true, searchable: false }
                ],
                take,
                0,
                'AND',
            );

            tubular.createGridResponse(request, queryBuilder)
                .then(response => {
                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(1);
                    done();
                });
        });
    });

    describe("Filter", function () {
        it("filters using Equals", done => {
            const take = 10,
                filteredCount = 1;

            let queryBuilder = knex.select('first_name', 'last_name', 'address_id').from('customer');

            let request = new GridRequest(
                [
                    {
                        name: 'first_name', label: 'First Name', sortable: true, searchable: true, filter: {
                            name: '',
                            text: 'Patricia',
                            argument: [],
                            operator: CompareOperators.Equals,
                            hasFilter: false
                        }
                    },
                    { name: 'last_name', label: 'Last Name', sortable: true, searchable: true },
                    { name: 'address_id', label: 'Address Id', sortable: true, searchable: false }
                ],
                take,
                0
            );

            tubular.createGridResponse(request, queryBuilder)
                .then(response => {
                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(1);
                    done();
                });
        });

        it("filters using NotEquals", done => {
            const take = 10,
                filteredCount = 598;

            let queryBuilder = knex.select('first_name', 'last_name', 'address_id').from('customer');

            let request = new GridRequest(
                [
                    {
                        name: 'first_name', label: 'First Name', sortable: true, searchable: true, filter: {
                            name: '',
                            text: 'Patricia',
                            argument: [],
                            operator: CompareOperators.NotEquals,
                            hasFilter: false
                        }
                    },
                    { name: 'last_name', label: 'Last Name', sortable: true, searchable: true },
                    { name: 'address_id', label: 'Address Id', sortable: true, searchable: false }
                ],
                take,
                0,
            );

            tubular.createGridResponse(request, queryBuilder)
                .then(response => {
                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(take);
                    done();
                });
        });

        it("filters using Contains", done => {
            const take = 10,
                filteredCount = 5;

            let request = new GridRequest(
                [
                    {
                        name: 'first_name', label: 'First Name', sortable: true, searchable: true, filter: {
                            name: '',
                            text: 'ley',
                            argument: [],
                            operator: CompareOperators.Contains,
                            hasFilter: false
                        }
                    },
                    { name: 'last_name', label: 'Last Name', sortable: true, searchable: true },
                    { name: 'address_id', label: 'Address Id', sortable: true, searchable: false }
                ],
                take,
                0
            );

            let queryBuilder = knex.select('first_name', 'last_name', 'address_id').from('customer');

            tubular.createGridResponse(request, queryBuilder)
                .then(response => {
                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(filteredCount);
                    done();
                });
        });

        it("filters using NotContains", done => {
            const take = 10,
                filteredCount = 594;

            let request = new GridRequest(
                [
                    {
                        name: 'first_name', label: 'First Name', sortable: true, searchable: true, filter: {
                            name: '',
                            text: 'ley',
                            argument: [],
                            operator: CompareOperators.NotContains,
                            hasFilter: false
                        }
                    },
                    { name: 'last_name', label: 'Last Name', sortable: true, searchable: true },
                    { name: 'address_id', label: 'Address Id', sortable: true, searchable: false }
                ],
                take,
                0,
                '',
            );

            let queryBuilder = knex.select('first_name', 'last_name', 'address_id').from('customer');

            tubular.createGridResponse(request, queryBuilder)
                .then(response => {
                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(take);
                    done();
                });
        });

        it("filters using StartsWith", done => {
            const take = 10,
                filteredCount = 5;

            let request = new GridRequest(
                [
                    {
                        name: 'first_name', label: 'First Name', sortable: true, searchable: true, filter: {
                            name: '',
                            text: 'na',
                            argument: [],
                            operator: CompareOperators.StartsWith,
                            hasFilter: false
                        }
                    },
                    { name: 'last_name', label: 'Last Name', sortable: true, searchable: true },
                    { name: 'address_id', label: 'Address Id', sortable: true, searchable: false }
                ],
                take,
                0,
            );

            let queryBuilder = knex.select('first_name', 'last_name', 'address_id').from('customer');

            tubular.createGridResponse(request, queryBuilder)
                .then(response => {
                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(filteredCount);
                    done();
                });
        });

        it("filters using NotStartsWith", done => {
            const skip = 0,
                take = 10,
                filteredCount = 594;

            let request = new GridRequest(
                [
                    {
                        name: 'first_name', label: 'First Name', sortable: true, searchable: true, filter: {
                            name: '',
                            text: 'na',
                            argument: [],
                            operator: CompareOperators.NotStartsWith,
                            hasFilter: false
                        }
                    },
                    { name: 'last_name', label: 'Last Name', sortable: true, searchable: true },
                    { name: 'address_id', label: 'Address Id', sortable: true, searchable: false }
                ],
                take,
                0,
            );

            let queryBuilder = knex.select('first_name', 'last_name', 'address_id').from('customer');

            tubular.createGridResponse(request, queryBuilder)
                .then(response => {
                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(take);
                    done();
                });
        });

        it("filters using EndsWith", done => {
            const take = 10,
                filteredCount = 8;

            let request = new GridRequest(
                [
                    {
                        name: 'first_name', label: 'First Name', sortable: true, searchable: true, filter: {
                            name: '',
                            text: 'rry',
                            argument: [],
                            operator: CompareOperators.EndsWith,
                            hasFilter: false
                        }
                    },
                    { name: 'last_name', label: 'Last Name', sortable: true, searchable: true },
                    { name: 'address_id', label: 'Address Id', sortable: true, searchable: false }
                ],
                take,
                0,
            );

            let queryBuilder = knex.select('first_name', 'last_name', 'address_id').from('customer');

            tubular.createGridResponse(request, queryBuilder)
                .then(response => {
                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(filteredCount);
                    done();
                });
        });

        it("filters using NotEndsWith", done => {
            const take = 10,
                filteredCount = 591;

            let request = new GridRequest(
                [
                    {
                        name: 'first_name', label: 'First Name', sortable: true, searchable: true, filter: {
                            name: '',
                            text: 'rry',
                            argument: [],
                            operator: CompareOperators.NotEndsWith,
                            hasFilter: false
                        }
                    },
                    { name: 'last_name', label: 'Last Name', sortable: true, searchable: true },
                    { name: 'address_id', label: 'Address Id', sortable: true, searchable: false }
                ],
                take,
                0
            );

            let queryBuilder = knex.select('first_name', 'last_name', 'address_id').from('customer');

            tubular.createGridResponse(request, queryBuilder)
                .then(response => {
                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(take);
                    done();
                });
        });

        it("filters using Gte", done => {
            const take = 10,
                filteredCount = 2;

            let request = new GridRequest(
                [
                    { name: 'first_name', label: 'First Name', sortable: true, searchable: true },
                    { name: 'last_name', label: 'Last Name', sortable: true, searchable: true },
                    {
                        name: 'customer_id', label: 'Customer Id', sortable: true, searchable: false, filter: {
                            name: '',
                            text: 598,
                            argument: [],
                            operator: CompareOperators.Gte,
                            hasFilter: false
                        }
                    }
                ],
                take,
                0,
            );

            let queryBuilder = knex.select('first_name', 'last_name', 'customer_id').from('customer');

            tubular.createGridResponse(request, queryBuilder)
                .then(response => {
                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(filteredCount);
                    done();
                });
        });

        it("filters using Gt", done => {
            const take = 10,
                filteredCount = 1;

            let request = new GridRequest(
                [
                    { name: 'first_name', label: 'First Name', sortable: true, searchable: true },
                    { name: 'last_name', label: 'Last Name', sortable: true, searchable: true },
                    {
                        name: 'customer_id', label: 'Customer Id', sortable: true, searchable: false, filter: {
                            name: '',
                            text: 598,
                            argument: [],
                            operator: CompareOperators.Gt,
                            hasFilter: false
                        }
                    }
                ],
                take,
                0,
            );

            let queryBuilder = knex.select('first_name', 'last_name', 'customer_id').from('customer');

            tubular.createGridResponse(request, queryBuilder)
                .then(response => {
                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(filteredCount);
                    done();
                });
        });

        it("filters using Lte", done => {
            const take = 10,
                filteredCount = 2;

            let request = new GridRequest(
                [
                    { name: 'first_name', label: 'First Name', sortable: true, searchable: true },
                    { name: 'last_name', label: 'Last Name', sortable: true, searchable: true },
                    {
                        name: 'customer_id', label: 'Customer Id', sortable: true, searchable: false, filter: {
                            name: '',
                            text: 2,
                            argument: [],
                            operator: CompareOperators.Lte,
                            hasFilter: false
                        }
                    }
                ],
                take,
                0,
            );

            let queryBuilder = knex.select('first_name', 'last_name', 'customer_id').from('customer');

            tubular.createGridResponse(request, queryBuilder)
                .then(response => {
                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(filteredCount);
                    done();
                });
        });

        it("filters using Lt", done => {
            const take = 10,
                filteredCount = 1;

            let request = new GridRequest(
                [
                    { name: 'first_name', label: 'First Name', sortable: true, searchable: true },
                    { name: 'last_name', label: 'Last Name', sortable: true, searchable: true },
                    {
                        name: 'customer_id', label: 'Customer Id', sortable: true, searchable: false, filter: {
                            name: '',
                            text: 2,
                            argument: [],
                            operator: CompareOperators.Lt,
                            hasFilter: false
                        }
                    }
                ],
                take,
                0,
            );

            let queryBuilder = knex.select('first_name', 'last_name', 'customer_id').from('customer');

            tubular.createGridResponse(request, queryBuilder)
                .then(response => {
                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(filteredCount);
                    done();
                });
        });

        it("filters using Between", done => {
            const take = 10,
                filteredCount = 597;

            let request = new GridRequest(
                [
                    { name: 'first_name', label: 'First Name', sortable: true, searchable: true },
                    { name: 'last_name', label: 'Last Name', sortable: true, searchable: true },
                    {
                        name: 'customer_id', label: 'Customer Id', sortable: true, searchable: false, filter: {
                            name: '',
                            text: 2,
                            argument: [598],
                            operator: CompareOperators.Between,
                            hasFilter: false
                        }
                    }
                ],
                take,
                0,
            );

            let queryBuilder = knex.select('first_name', 'last_name', 'customer_id').from('customer');

            tubular.createGridResponse(request, queryBuilder)
                .then(response => {
                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(10);
                    done();
                });
        });

        it("fails due to unknwon Compare Operator", () => {
            const take = 10;

            let request = new GridRequest(
                [
                    { name: 'first_name', label: 'First Name', sortable: true, searchable: true },
                    { name: 'last_name', label: 'Last Name', sortable: true, searchable: true },
                    {
                        name: 'customer_id', label: 'Customer Id', sortable: true, searchable: false, filter: {
                            name: '',
                            text: 2,
                            argument: [598],
                            operator: 'Unknown',
                            hasFilter: false,
                        },
                    }
                ],
                take,
                0,
            );

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


            let request = new GridRequest(
                [
                    {
                        name: 'first_name', label: 'First Name', sortable: true, searchable: true
                    },
                    {
                        name: 'last_name', label: 'Last Name', sortable: true, searchable: true
                    },
                    {
                        name: 'address_id', label: 'Address Id', sortable: true, searchable: false
                    }
                ],
                take,
                0,
            );

            tubular.createGridResponse(request, queryBuilder)
                .then(response => {
                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(take);
                    expect(response.payload[0][0]).toBe('AARON');
                    done();
                });
        });

        it(" sorts by specific column", done => {
            const take = 10,
                filteredCount = 599,
                totalRecordCount = 599;

            let queryBuilder = knex.select('first_name', 'last_name', 'address_id').from('customer');


            let request = new GridRequest([
                {
                    name: 'first_name', label: 'First Name', sortable: true, searchable: true
                },
                {
                    name: 'last_name', label: 'Last Name', sortable: true, searchable: true, sortOrder: 2, sortDirection: 'Ascending'
                },
                {
                    name: 'address_id', label: 'Address Id', sortable: true, searchable: false
                }
            ],
                take,
                0,
            );

            tubular.createGridResponse(request, queryBuilder)
                .then(response => {
                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(take);
                    expect(response.payload[0][1]).toBe('ABNEY');
                    done();
                });
        });

        it(" sorts by TWO columns", done => {
            const take = 10,
                filteredCount = 599,
                totalRecordCount = 599;

            let queryBuilder = knex.select('first_name', 'last_name', 'active').from('customer');


            let request = new GridRequest(
                [
                    {
                        name: 'first_name', label: 'First Name', sortable: true, searchable: true
                    },
                    {
                        name: 'last_name', label: 'Last Name', sortable: true, searchable: true, sortOrder: 2, sortDirection: 'Ascending'
                    },
                    {
                        name: 'active', label: 'Is Active', sortable: true, searchable: false, sortOrder: 3, sortDirection: 'Ascending'
                    }
                ],
                take,
                0,
            );

            tubular.createGridResponse(request, queryBuilder)
                .then(response => {
                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(take);
                    expect(response.payload[0][2]).toBe(0);
                    expect(response.payload[0][1]).toBe('ARCE');
                    done();
                });
        });
    });

    describe("Aggregate", function () {

        it("uses Count", done => {
            const take = 10,
                filteredCount = totalRecordCount;

            let request = new GridRequest(
                [
                    {
                        name: 'first_name', label: 'First Name', sortable: true, searchable: true, aggregate: AggregateFunctions.Count
                    },
                    {
                        name: 'last_name', label: 'Last Name', sortable: true, searchable: true
                    },
                    {
                        name: 'address_id', label: 'Address Id', sortable: true, searchable: false
                    }
                ],
                take,
                0,
            );

            let queryBuilder = knex.select('first_name', 'last_name', 'address_id').from('customer');

            tubular.createGridResponse(request, queryBuilder)
                .then(response => {
                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(take);
                    expect(response.aggregationPayload).toBeDefined();
                    expect(response.aggregationPayload.first_name).toBe(totalRecordCount);

                    done();
                });
        });

        it("uses Distinct Count", done => {
            const take = 10,
                filteredCount = totalRecordCount;

            let request = new GridRequest([
                {
                    name: 'first_name', label: 'First Name', sortable: true, searchable: true
                },
                {
                    name: 'last_name', label: 'Last Name', sortable: true, searchable: true
                },
                {
                    name: 'active', label: 'Is Active', sortable: true, searchable: false, aggregate: AggregateFunctions.DistinctCount
                }
            ],
                take,
                0,
            );

            let queryBuilder = knex.select('first_name', 'last_name', 'active').from('customer');

            tubular.createGridResponse(request, queryBuilder)
                .then(response => {

                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(take);
                    expect(response.aggregationPayload).toBeDefined();
                    expect(response.aggregationPayload.active).toBe(2);

                    done();
                });
        });

        it("uses Max", done => {
            const take = 10,
                filteredCount = totalRecordCount;

            let request = new GridRequest(
                [
                    {
                        name: 'first_name', label: 'First Name', sortable: true, searchable: true, sortOrder: 2, sortDirection: 'Ascending'
                    },
                    {
                        name: 'last_name', label: 'Last Name', sortable: true, searchable: true, sortOrder: 3, sortDirection: 'Ascending'
                    },
                    {
                        name: 'address_id', label: 'Address Id', sortable: true, searchable: false, aggregate: AggregateFunctions.Max
                    }
                ],
                take,
                0,
            );

            let queryBuilder = knex.select('first_name', 'last_name', 'address_id').from('customer');

            tubular.createGridResponse(request, queryBuilder)
                .then(response => {
                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(take);
                    expect(response.aggregationPayload).toBeDefined();
                    expect(response.aggregationPayload.address_id).toBe(605);

                    done();
                });
        });

        it("uses Min", done => {
            const take = 10,
                filteredCount = totalRecordCount;

            let request = new GridRequest(
                [
                    {
                        name: 'first_name', label: 'First Name', sortable: true, searchable: true, sortOrder: 2, sortDirection: 'Ascending'
                    },
                    {
                        name: 'last_name', label: 'Last Name', sortable: true, searchable: true, sortOrder: 3, sortDirection: 'Ascending'
                    },
                    {
                        name: 'address_id', label: 'Address Id', sortable: true, searchable: false, aggregate: AggregateFunctions.Min
                    }
                ],
                take,
                0,
            );

            let queryBuilder = knex.select('first_name', 'last_name', 'address_id').from('customer');

            tubular.createGridResponse(request, queryBuilder)
                .then(response => {
                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(take);
                    expect(response.aggregationPayload).toBeDefined();
                    expect(response.aggregationPayload.address_id).toBe(5);

                    done();
                });
        });

        it("uses Average", done => {
            const take = 10;
            filteredCount = totalRecordCount;

            let request = new GridRequest(
                [
                    {
                        name: 'first_name', label: 'First Name', sortable: true, searchable: true, sortOrder: 2, sortDirection: 'Ascending'
                    },
                    {
                        name: 'last_name', label: 'Last Name', sortable: true, searchable: true, sortOrder: 3, sortDirection: 'Ascending'
                    },
                    {
                        name: 'address_id', label: 'Address Id', sortable: true, searchable: false
                    },
                    {
                        name: 'customer_id', label: 'Customer Id', sortable: true, searchable: false, aggregate: AggregateFunctions.Average
                    }
                ],
                take,
                0,
            );

            let queryBuilder = knex.select('first_name', 'last_name', 'address_id', 'customer_id').from('customer');

            tubular.createGridResponse(request, queryBuilder)
                .then(response => {
                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(take);
                    expect(response.aggregationPayload).toBeDefined();
                    expect(Math.round(response.aggregationPayload.customer_id)).toBe(300);

                    done();
                });
        });

        it("uses Sum", done => {
            const take = 10,
                filteredCount = totalRecordCount;

            let request = new GridRequest([
                {
                    name: 'first_name', label: 'First Name', sortable: true, searchable: true, sortOrder: 2, sortDirection: 'Ascending'
                },
                {
                    name: 'last_name', label: 'Last Name', sortable: true, searchable: true, sortOrder: 3, sortDirection: 'Ascending'
                },
                {
                    name: 'address_id', label: 'Address Id', sortable: true, searchable: false, aggregate: AggregateFunctions.Sum
                }
            ],
                take,
                0,
            );

            let queryBuilder = knex.select('first_name', 'last_name', 'address_id', 'customer_id').from('customer');

            tubular.createGridResponse(request, queryBuilder)
                .then(response => {
                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(take);
                    expect(response.aggregationPayload).toBeDefined();
                    expect(response.aggregationPayload.address_id).toBe(182530);

                    done();
                });
        });

        it("fails due to unknwon aggregate", () => {
            const take = 10;

            let request = new GridRequest(
                [
                    {
                        name: 'first_name', label: 'First Name', sortable: true, searchable: true, sortOrder: 2, sortDirection: 'Ascending'
                    },
                    {
                        name: 'last_name', label: 'Last Name', sortable: true, searchable: true, sortOrder: 3, sortDirection: 'Ascending'
                    },
                    {
                        name: 'address_id', label: 'Address Id', sortable: true, searchable: false, aggregate: 'Unknown'
                    }
                ],
                take,
                0,
            );

            let queryBuilder = knex.select('first_name', 'last_name', 'address_id', 'customer_id').from('customer');

            expect(() => tubular.createGridResponse(request, queryBuilder)).toThrow("Unsupported aggregate function");
        });

        it(" aggregate on one column", done => {
            const take = 10,
                filteredCount = 32,
                totalRecordCount = 16049;

            let queryBuilder = knex.select('customer_id', 'amount', 'payment_id').from('payment');


            let request = new GridRequest(
                [
                    {
                        name: 'customer_id', label: 'Customer Id', sortable: true, searchable: true, filter: {
                            name: '',
                            text: 1,
                            argument: [],
                            operator: CompareOperators.Equals,
                            hasFilter: false
                        }
                    },
                    {
                        name: 'amount', label: 'Amount', sortable: true, searchable: true, aggregate: AggregateFunctions.Sum
                    },
                    {
                        name: 'payment_id', label: 'Payment Id', sortable: true, searchable: false
                    }
                ],
                take,
                0,
            );

            tubular.createGridResponse(request, queryBuilder)
                .then(response => {

                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(take);
                    expect(response.aggregationPayload).toBeDefined();
                    expect(response.aggregationPayload.amount).toBeGreaterThan(0);

                    done();
                });
        });

        it(" aggregate on two columns", done => {
            const take = 10,
                filteredCount = 32,
                totalRecordCount = 16049;

            let queryBuilder = knex.select('customer_id', 'amount', 'payment_id').from('payment');

            let request = new GridRequest(
                [
                    {
                        name: 'customer_id', label: 'Customer Id', sortable: true, searchable: true, filter: {
                            name: '',
                            text: 1,
                            argument: [],
                            operator: CompareOperators.Equals,
                            hasFilter: false
                        }
                    },
                    {
                        name: 'amount', label: 'Amount', sortable: true, searchable: true, aggregate: AggregateFunctions.Sum
                    },
                    {
                        name: 'payment_id', label: 'Payment Id', sortable: true, searchable: false, aggregate: AggregateFunctions.Count
                    }
                ],
                take,
                0,
            );

            tubular.createGridResponse(request, queryBuilder)
                .then(response => {

                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(take);
                    expect(response.aggregationPayload).toBeDefined();
                    expect(response.aggregationPayload.amount).toBeGreaterThan(0);
                    expect(response.aggregationPayload.payment_id).toBeGreaterThan(0);

                    done();
                });
        });
    });
});
