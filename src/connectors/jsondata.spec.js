var tubular = require('../tubular')('jsondata');
var data = require('../../spec/data/jsondata.json');
var { GridRequest } = require('tubular-common');
var { CompareOperators } = require('tubular-common');

var totalRecordCount = 50;

describe("jsondata connector", function () {

    describe("Paging", function () {
        it("skipping first 10 and taking 20", done => {
            const take = 20,
                filteredCount = 49;

            let request = new GridRequest([
                {
                    name: 'first_name', label: 'First Name', sortable: true, searchable: true, filter: {
                        name: '',
                        text: 'Ignacius',
                        argument: [],
                        operator: CompareOperators.NotEquals,
                        hasFilter: false
                    }
                },
                { name: 'last_name', label: 'Last Name', sortable: true, searchable: true },
                { name: 'address_id', label: 'Address Id', sortable: true, searchable: false }
            ],
                take,
                0);

            tubular.createGridResponse(request, data)
                .then(response => {
                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(take);
                    done();
                });
        });
    });

    describe("Search and Filter", function () {

        it(" use free text search", done => {
            const take = 10,
                filteredCount = 2;

            let request = new GridRequest(
                [
                    { name: 'first_name', label: 'First Name', sortable: true, searchable: true },
                    { name: 'last_name', label: 'Last Name', sortable: true, searchable: true },
                    { name: 'address_id', label: 'Address Id', sortable: true, searchable: false }
                ],
                take,
                0,
                'And'
            );

            tubular.createGridResponse(request, data)
                .then(response => {
                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(filteredCount);
                    done();
                });
        });

        it(" filters by one column", done => {
            const take = 10,
                filteredCount = 1;

            let request = new GridRequest(
                [
                    {
                        name: 'first_name', label: 'First Name', sortable: true, searchable: true, filter: {
                            name: '',
                            text: 'ucy',
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

            tubular.createGridResponse(request, data)
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

            let request = new GridRequest(
                [
                    {
                        name: 'first_name', label: 'First Name', sortable: true, searchable: true, filter: {
                            name: '',
                            text: 'Merrick',
                            argument: [],
                            operator: CompareOperators.Equals,
                            hasFilter: false
                        }
                    },
                    {
                        name: 'last_name', label: 'Last Name', sortable: true, searchable: true, filter: {
                            name: '',
                            text: 'Probart',
                            argument: [],
                            operator: CompareOperators.Equals,
                            hasFilter: false
                        }
                    },
                    { name: 'address_id', label: 'Address Id', sortable: true, searchable: false }
                ],
                take,
                0,
                'rr'
            );

            tubular.createGridResponse(request, data)
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

            let request = new GridRequest(
                [
                    {
                        name: 'first_name', label: 'First Name', sortable: true, searchable: true, filter: {
                            name: '',
                            text: 'Ignacius',
                            argument: [],
                            operator: CompareOperators.Equals,
                            hasFilter: false
                        }
                    },
                    { name: 'last_name', label: 'Last Name', sortable: true, searchable: true },
                    { name: 'address_id', label: 'Address Id', sortable: true, searchable: false }
                ],
                take,
                0,
            );

            tubular.createGridResponse(request, data)
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
                filteredCount = 49;

            let request = new GridRequest(
                [
                    {
                        name: 'first_name', label: 'First Name', sortable: true, searchable: true, filter: {
                            name: '',
                            text: 'Ignacius',
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

            tubular.createGridResponse(request, data)
                .then(response => {
                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(10);
                    done();
                });
        });

        it("filters using Contains", done => {
            const take = 10,
                filteredCount = 2;

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

            tubular.createGridResponse(request, data)
                .then(response => {
                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(2);
                    done();
                });
        });

        it("filters using NotContains", done => {
            const take = 10,
                filteredCount = 48;

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
                0
            );

            tubular.createGridResponse(request, data)
                .then(response => {
                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(10);
                    done();
                });
        });

        it("filters using StartsWith", done => {
            const take = 10,
                filteredCount = 3;

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
                0
            );

            tubular.createGridResponse(request, data)
                .then(response => {
                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(3);
                    done();
                });
        });

        it("filters using NotStartsWith", done => {
            const take = 10,
                filteredCount = 47;

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

            tubular.createGridResponse(request, data)
                .then(response => {
                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(10);
                    done();
                });
        });

        it("filters using EndsWith", done => {
            const take = 10,
                filteredCount = 2;

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
                0
            );

            tubular.createGridResponse(request, data)
                .then(response => {
                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(2);
                    done();
                });
        });

        it("filters using NotEndsWith", done => {
            const take = 10,
                filteredCount = 48;

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
                0,
            );

            tubular.createGridResponse(request, data)
                .then(response => {
                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(10);
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
                        name: 'address_id', label: 'Address Id', sortable: true, searchable: false, filter: {
                            name: '',
                            text: 49,
                            argument: [],
                            operator: CompareOperators.Gte,
                            hasFilter: false
                        }
                    }
                ],
                take,
                0,
            );

            tubular.createGridResponse(request, data)
                .then(response => {
                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(2);
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
                        name: 'address_id', label: 'Address Id', sortable: true, searchable: false, filter: {
                            name: '',
                            text: 49,
                            argument: [],
                            operator: CompareOperators.Gt,
                            hasFilter: false
                        }
                    }
                ],
                take,
                0,
            );

            tubular.createGridResponse(request, data)
                .then(response => {
                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(1);
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
                        name: 'address_id', label: 'Address Id', sortable: true, searchable: false, filter: {
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

            tubular.createGridResponse(request, data)
                .then(response => {
                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(2);
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
                        name: 'address_id', label: 'Address Id', sortable: true, searchable: false, filter: {
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

            tubular.createGridResponse(request, data)
                .then(response => {
                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(1);
                    done();
                });
        });

        it("filters using Between", done => {
            const take = 10,
                filteredCount = 48;

            let request = new GridRequest(
                [
                    { name: 'first_name', label: 'First Name', sortable: true, searchable: true },
                    { name: 'last_name', label: 'Last Name', sortable: true, searchable: true },
                    {
                        name: 'address_id', label: 'Address Id', sortable: true, searchable: false, filter: {
                            name: '',
                            text: 1,
                            argument: [50],
                            operator: CompareOperators.Between,
                            hasFilter: false
                        }
                    }
                ],
                take,
                0,
            );

            tubular.createGridResponse(request, data)
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
                        name: 'address_id', label: 'Address Id', sortable: true, searchable: false, filter: {
                            name: '',
                            text: 1,
                            argument: [50],
                            operator: 'Unknown',
                            hasFilter: false
                        }
                    }
                ],
                take,
                0,
            );

            expect(() => tubular.createGridResponse(request, data)).toThrow("Unsupported Compare Operator");
        });
    });

    describe("Sort", function () {

        it("sorts by default column", done => {
            const take = 10,
                filteredCount = totalRecordCount;

            let request = new GridRequest(
                [
                    {
                        name: 'first_name', label: 'First Name', sortable: true, searchable: true
                    },
                    {
                        name: 'last_name', label: 'Last Name', sortable: true, searchable: true
                    },
                    {
                        name: 'address_id', label: 'Address Id', sortable: true, searchable: false, sortDirection: 'Descending'
                    }
                ],
                take,
                0,
            );

            tubular.createGridResponse(request, data)
                .then(response => {
                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(take);
                    expect(response.payload[0][0]).toBe('Abramo');
                    done();
                }
                );
        });

        it("sorts by default column and go to page 2", done => {
            const page = 1,
                take = 10,
                filteredCount = totalRecordCount;

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
                page,
            );

            tubular.createGridResponse(request, data)
                .then(response => {
                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(take);
                    expect(response.payload[0][0]).toBe('Clare');
                    done();
                });
        });

        it("sorts by specific column", done => {
            const take = 10,
                filteredCount = totalRecordCount;

            let request = new GridRequest(
                [
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

            tubular.createGridResponse(request, data)
                .then(response => {
                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(take);
                    expect(response.payload[0][1]).toBe('Allworthy');
                    done();
                });
        });

        it("sorts by TWO columns", done => {
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
                        name: 'address_id', label: 'Address Id', sortable: true, searchable: false
                    }
                ],
                take,
                0,
            );

            tubular.createGridResponse(request, data)
                .then(response => {
                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(take);
                    expect(response.payload[0][2]).toBe(2);
                    expect(response.payload[0][1]).toBe('Allworthy');
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
                        name: 'first_name', label: 'First Name', sortable: true, searchable: true, aggregate: 'Count'
                    },
                    {
                        name: 'last_name', label: 'Last Name', sortable: true, searchable: true
                    },
                    {
                        name: 'address_id', label: 'Address Id', sortable: true, searchable: false
                    }
                ],
                take,
                0
            );

            tubular.createGridResponse(request, data)
                .then(response => {
                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(take);
                    expect(response.aggregationPayload).toBeDefined();
                    expect(response.aggregationPayload.first_name).toBe(50);

                    done();
                });
        });

        it("uses Distinct Count", done => {
            const take = 10,
                filteredCount = totalRecordCount;

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
                    },
                    {
                        name: 'is_active', label: 'Is Active', sortable: true, searchable: false, aggregate: 'DistinctCount'
                    }
                ],
                take,
                0,
            );

            tubular.createGridResponse(request, data)
                .then(response => {

                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(take);
                    expect(response.aggregationPayload).toBeDefined();
                    expect(response.aggregationPayload.is_active).toBe(2);

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
                        name: 'address_id', label: 'Address Id', sortable: true, searchable: false, aggregate: 'Max'
                    }
                ],
                take,
                0,
            );

            tubular.createGridResponse(request, data)
                .then(response => {
                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(take);
                    expect(response.aggregationPayload).toBeDefined();
                    expect(response.aggregationPayload.address_id).toBe(50);

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
                        name: 'address_id', label: 'Address Id', sortable: true, searchable: false, aggregate: 'Min'
                    }
                ],
                take,
                0,
            );

            tubular.createGridResponse(request, data)
                .then(response => {
                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(take);
                    expect(response.aggregationPayload).toBeDefined();
                    expect(response.aggregationPayload.address_id).toBe(1);

                    done();
                });
        });

        it("uses Average", done => {
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
                        name: 'address_id', label: 'Address Id', sortable: true, searchable: false, aggregate: 'Average'
                    }
                ],
                take,
                0,
            );

            tubular.createGridResponse(request, data)
                .then(response => {
                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(take);
                    expect(response.aggregationPayload).toBeDefined();
                    expect(response.aggregationPayload.address_id).toBe(25.5);

                    done();
                });
        });

        it("uses Sum", done => {
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
                        name: 'address_id', label: 'Address Id', sortable: true, searchable: false, aggregate: 'Sum'
                    }
                ],
                take,
                0,
            );

            tubular.createGridResponse(request, data)
                .then(response => {
                    expect(response.counter).toBeDefined();
                    expect(response.totalRecordCount).toBe(totalRecordCount);
                    expect(response.filteredRecordCount).toBe(filteredCount);
                    expect(response.totalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.payload.length).toBe(take);
                    expect(response.aggregationPayload).toBeDefined();
                    expect(response.aggregationPayload.address_id).toBe(1275);

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

            expect(() => tubular.createGridResponse(request, data)).toThrow("Unsupported aggregate function");
        });
    });
});