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
                    Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, Filter: {
                        Name: '',
                        Text: 'Ignacius',
                        Argument: [],
                        Operator: CompareOperators.NOT_EQUALS,
                        HasFilter: false
                    }
                },
                { Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true },
                { Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false }
            ],
                take,
                0);

            tubular.createGridResponse(request, data)
                .then(response => {
                    expect(response.Counter).toBeDefined();
                    expect(response.TotalRecordCount).toBe(totalRecordCount);
                    expect(response.FilteredRecordCount).toBe(filteredCount);
                    expect(response.TotalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.Payload.length).toBe(take);
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
                    { Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true },
                    { Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true },
                    { Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false }
                ],
                take,
                0,
                'And'
            );

            tubular.createGridResponse(request, data)
                .then(response => {
                    expect(response.Counter).toBeDefined();
                    expect(response.TotalRecordCount).toBe(totalRecordCount);
                    expect(response.FilteredRecordCount).toBe(filteredCount);
                    expect(response.TotalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.Payload.length).toBe(filteredCount);
                    done();
                });
        });

        it(" filters by one column", done => {
            const take = 10,
                filteredCount = 1;

            let request = new GridRequest(
                [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, Filter: {
                            Name: '',
                            Text: 'ucy',
                            Argument: [],
                            Operator: CompareOperators.CONTAINS,
                            HasFilter: false
                        }
                    },
                    { Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true },
                    { Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false }
                ],
                take,
                0,
                'GEO'
            );

            tubular.createGridResponse(request, data)
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
            const take = 10,
                filteredCount = 1;

            let request = new GridRequest(
                [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, Filter: {
                            Name: '',
                            Text: 'Merrick',
                            Argument: [],
                            Operator: CompareOperators.EQUALS,
                            HasFilter: false
                        }
                    },
                    {
                        Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true, Filter: {
                            Name: '',
                            Text: 'Probart',
                            Argument: [],
                            Operator: CompareOperators.EQUALS,
                            HasFilter: false
                        }
                    },
                    { Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false }
                ],
                take,
                0,
                'rr'
                );

            tubular.createGridResponse(request, data)
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
            const take = 10,
                filteredCount = 1;

            let request = new GridRequest(
                [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, Filter: {
                            Name: '',
                            Text: 'Ignacius',
                            Argument: [],
                            Operator: CompareOperators.EQUALS,
                             HasFilter: false
                        }
                    },
                    { Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true },
                    { Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false }
                ],
                take,
                0,
                );

            tubular.createGridResponse(request, data)
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
            const take = 10,
                filteredCount = 49;

            let request = new GridRequest(
                [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, Filter: {
                            Name: '',
                            Text: 'Ignacius',
                            Argument: [],
                            Operator: CompareOperators.NOT_EQUALS,
                            HasFilter: false
                        }
                    },
                    { Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true },
                    { Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false }
                ],
                take,
                0,
            );

            tubular.createGridResponse(request, data)
                .then(response => {
                    expect(response.Counter).toBeDefined();
                    expect(response.TotalRecordCount).toBe(totalRecordCount);
                    expect(response.FilteredRecordCount).toBe(filteredCount);
                    expect(response.TotalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.Payload.length).toBe(10);
                    done();
                });
        });

        it("filters using Contains", done => {
            const take = 10,
                filteredCount = 2;

            let request = new GridRequest(
                [
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
                ],
                take,
                0
            );

            tubular.createGridResponse(request, data)
                .then(response => {
                    expect(response.Counter).toBeDefined();
                    expect(response.TotalRecordCount).toBe(totalRecordCount);
                    expect(response.FilteredRecordCount).toBe(filteredCount);
                    expect(response.TotalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.Payload.length).toBe(2);
                    done();
                });
        });

        it("filters using NotContains", done => {
            const take = 10,
                filteredCount = 48;

            let request = new GridRequest(
                [
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
                ],
                take,
                0
            );

            tubular.createGridResponse(request, data)
                .then(response => {
                    expect(response.Counter).toBeDefined();
                    expect(response.TotalRecordCount).toBe(totalRecordCount);
                    expect(response.FilteredRecordCount).toBe(filteredCount);
                    expect(response.TotalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.Payload.length).toBe(10);
                    done();
                });
        });

        it("filters using StartsWith", done => {
            const take = 10,
                filteredCount = 3;

            let request = new GridRequest(
                [
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
                ],
                take,
                0
            );

            tubular.createGridResponse(request, data)
                .then(response => {
                    expect(response.Counter).toBeDefined();
                    expect(response.TotalRecordCount).toBe(totalRecordCount);
                    expect(response.FilteredRecordCount).toBe(filteredCount);
                    expect(response.TotalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.Payload.length).toBe(3);
                    done();
                });
        });

        it("filters using NotStartsWith", done => {
            const take = 10,
                filteredCount = 47;

            let request = new GridRequest(
                [
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
                ],
                take,
                0,
            );

            tubular.createGridResponse(request, data)
                .then(response => {
                    expect(response.Counter).toBeDefined();
                    expect(response.TotalRecordCount).toBe(totalRecordCount);
                    expect(response.FilteredRecordCount).toBe(filteredCount);
                    expect(response.TotalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.Payload.length).toBe(10);
                    done();
                });
        });

        it("filters using EndsWith", done => {
            const take = 10,
                filteredCount = 2;

            let request = new GridRequest(
                [
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
                ],
                take,
                0
            );

            tubular.createGridResponse(request, data)
                .then(response => {
                    expect(response.Counter).toBeDefined();
                    expect(response.TotalRecordCount).toBe(totalRecordCount);
                    expect(response.FilteredRecordCount).toBe(filteredCount);
                    expect(response.TotalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.Payload.length).toBe(2);
                    done();
                });
        });

        it("filters using NotEndsWith", done => {
            const take = 10,
                filteredCount = 48;

            let request = new GridRequest(
                [
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
                ],
                take,
                0,
            );

            tubular.createGridResponse(request, data)
                .then(response => {
                    expect(response.Counter).toBeDefined();
                    expect(response.TotalRecordCount).toBe(totalRecordCount);
                    expect(response.FilteredRecordCount).toBe(filteredCount);
                    expect(response.TotalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.Payload.length).toBe(10);
                    done();
                });
        });

        it("filters using Gte", done => {
            const take = 10,
                filteredCount = 2;

            let request = new GridRequest(
                [
                    { Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true },
                    { Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true },
                    {
                        Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false, Filter: {
                            Name: '',
                            Text: 49,
                            Argument: [],
                            Operator: CompareOperators.GTE,
                            HasFilter: false
                        }
                    }
                ],
                take,
                0,
            );

            tubular.createGridResponse(request, data)
                .then(response => {
                    expect(response.Counter).toBeDefined();
                    expect(response.TotalRecordCount).toBe(totalRecordCount);
                    expect(response.FilteredRecordCount).toBe(filteredCount);
                    expect(response.TotalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.Payload.length).toBe(2);
                    done();
                });
        });

        it("filters using Gt", done => {
            const take = 10,
                filteredCount = 1;

            let request = new GridRequest(
                [
                    { Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true },
                    { Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true },
                    {
                        Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false, Filter: {
                            Name: '',
                            Text: 49,
                            Argument: [],
                            Operator: CompareOperators.GT,
                            HasFilter: false
                        }
                    }
                ],
                take,
                0,
            );

            tubular.createGridResponse(request, data)
                .then(response => {
                    expect(response.Counter).toBeDefined();
                    expect(response.TotalRecordCount).toBe(totalRecordCount);
                    expect(response.FilteredRecordCount).toBe(filteredCount);
                    expect(response.TotalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.Payload.length).toBe(1);
                    done();
                });
        });

        it("filters using Lte", done => {
            const take = 10,
                filteredCount = 2;

            let request = new GridRequest(
                [
                    { Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true },
                    { Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true },
                    {
                        Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false, Filter: {
                            Name: '',
                            Text: 2,
                            Argument: [],
                            Operator: CompareOperators.LTE,
                            HasFilter: false
                        }
                    }
                ],
                take,
                0,
            );

            tubular.createGridResponse(request, data)
                .then(response => {
                    expect(response.Counter).toBeDefined();
                    expect(response.TotalRecordCount).toBe(totalRecordCount);
                    expect(response.FilteredRecordCount).toBe(filteredCount);
                    expect(response.TotalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.Payload.length).toBe(2);
                    done();
                });
        });

        it("filters using Lt", done => {
            const take = 10,
                filteredCount = 1;

            let request = new GridRequest(
                [
                    { Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true },
                    { Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true },
                    {
                        Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false, Filter: {
                            Name: '',
                            Text: 2,
                            Argument: [],
                            Operator: CompareOperators.LT,
                            HasFilter: false
                        }
                    }
                ],
                take,
                0,
            );

            tubular.createGridResponse(request, data)
                .then(response => {
                    expect(response.Counter).toBeDefined();
                    expect(response.TotalRecordCount).toBe(totalRecordCount);
                    expect(response.FilteredRecordCount).toBe(filteredCount);
                    expect(response.TotalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.Payload.length).toBe(1);
                    done();
                });
        });

        it("filters using Between", done => {
            const take = 10,
                filteredCount = 48;

            let request = new GridRequest(
                [
                    { Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true },
                    { Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true },
                    {
                        Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false, Filter: {
                            Name: '',
                            Text: 1,
                            Argument: [50],
                            Operator: CompareOperators.BETWEEN,
                            HasFilter: false
                        }
                    }
                ],
                take,
                0,
            );

            tubular.createGridResponse(request, data)
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
            const take = 10;

            let request = new GridRequest(
                [
                    { Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true },
                    { Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true },
                    {
                        Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false, Filter: {
                            Name: '',
                            Text: 1,
                            Argument: [50],
                            Operator: 'Unknown',
                            HasFilter: false
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
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true
                    },
                    {
                        Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true
                    },
                    {
                        Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false, ColumnSortDirection: 'Descending'
                    }
                ],
                take,
                0,
            );

            tubular.createGridResponse(request, data)
                .then(response => {
                    expect(response.Counter).toBeDefined();
                    expect(response.TotalRecordCount).toBe(totalRecordCount);
                    expect(response.FilteredRecordCount).toBe(filteredCount);
                    expect(response.TotalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.Payload.length).toBe(take);
                    expect(response.Payload[0][0]).toBe('Abramo');
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
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true
                    },
                    {
                        Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true
                    },
                    {
                        Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false
                    }
                ],
                take,
                page,
            );

            tubular.createGridResponse(request, data)
                .then(response => {
                    expect(response.Counter).toBeDefined();
                    expect(response.TotalRecordCount).toBe(totalRecordCount);
                    expect(response.FilteredRecordCount).toBe(filteredCount);
                    expect(response.TotalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.Payload.length).toBe(take);
                    expect(response.Payload[0][0]).toBe('Clare');
                    done();
                });
        });

        it("sorts by specific column", done => {
            const take = 10,
                filteredCount = totalRecordCount;

            let request = new GridRequest(
                [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true
                    },
                    {
                        Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true, SortOrder: 2, ColumnSortDirection: 'Ascending'
                    },
                    {
                        Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false
                    }
                ],
                take,
                0,
            );

            tubular.createGridResponse(request, data)
                .then(response => {
                    expect(response.Counter).toBeDefined();
                    expect(response.TotalRecordCount).toBe(totalRecordCount);
                    expect(response.FilteredRecordCount).toBe(filteredCount);
                    expect(response.TotalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.Payload.length).toBe(take);
                    expect(response.Payload[0][1]).toBe('Allworthy');
                    done();
                });
        });

        it("sorts by TWO columns", done => {
            const take = 10,
                filteredCount = totalRecordCount;

            let request = new GridRequest(
                [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, SortOrder: 2, ColumnSortDirection: 'Ascending'
                    },
                    {
                        Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true, SortOrder: 3, ColumnSortDirection: 'Ascending'
                    },
                    {
                        Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false
                    }
                ],
                take,
                0,
            );

            tubular.createGridResponse(request, data)
                .then(response => {
                    expect(response.Counter).toBeDefined();
                    expect(response.TotalRecordCount).toBe(totalRecordCount);
                    expect(response.FilteredRecordCount).toBe(filteredCount);
                    expect(response.TotalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.Payload.length).toBe(take);
                    expect(response.Payload[0][2]).toBe(2);
                    expect(response.Payload[0][1]).toBe('Allworthy');
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
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, Aggregate: 'Count'
                    },
                    {
                        Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true
                    },
                    {
                        Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false
                    }
                ],
                take,
                0
            );

            tubular.createGridResponse(request, data)
                .then(response => {
                    expect(response.Counter).toBeDefined();
                    expect(response.TotalRecordCount).toBe(totalRecordCount);
                    expect(response.FilteredRecordCount).toBe(filteredCount);
                    expect(response.TotalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.Payload.length).toBe(take);
                    expect(response.AggregationPayload).toBeDefined();
                    expect(response.AggregationPayload.first_name).toBe(50);

                    done();
                });
        });

        it("uses Distinct Count", done => {
            const take = 10,
                filteredCount = totalRecordCount;

            let request = new GridRequest(
                [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true
                    },
                    {
                        Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true
                    },
                    {
                        Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false
                    },
                    {
                        Name: 'is_active', Label: 'Is Active', Sortable: true, Searchable: false, Aggregate: 'DistinctCount'
                    }
                ],
                take,
                0,
            );

            tubular.createGridResponse(request, data)
                .then(response => {

                    expect(response.Counter).toBeDefined();
                    expect(response.TotalRecordCount).toBe(totalRecordCount);
                    expect(response.FilteredRecordCount).toBe(filteredCount);
                    expect(response.TotalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.Payload.length).toBe(take);
                    expect(response.AggregationPayload).toBeDefined();
                    expect(response.AggregationPayload.is_active).toBe(2);

                    done();
                });
        });

        it("uses Max", done => {
            const take = 10,
                filteredCount = totalRecordCount;

            let request = new GridRequest(
                [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, SortOrder: 2, ColumnSortDirection: 'Ascending'
                    },
                    {
                        Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true, SortOrder: 3, ColumnSortDirection: 'Ascending'
                    },
                    {
                        Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false, Aggregate: 'Max'
                    }
                ],
                take,
                0,
            );

            tubular.createGridResponse(request, data)
                .then(response => {
                    expect(response.Counter).toBeDefined();
                    expect(response.TotalRecordCount).toBe(totalRecordCount);
                    expect(response.FilteredRecordCount).toBe(filteredCount);
                    expect(response.TotalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.Payload.length).toBe(take);
                    expect(response.AggregationPayload).toBeDefined();
                    expect(response.AggregationPayload.address_id).toBe(50);

                    done();
                });
        });

        it("uses Min", done => {
            const take = 10,
                filteredCount = totalRecordCount;

            let request = new GridRequest(
                [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, SortOrder: 2, ColumnSortDirection: 'Ascending'
                    },
                    {
                        Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true, SortOrder: 3, ColumnSortDirection: 'Ascending'
                    },
                    {
                        Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false, Aggregate: 'Min'
                    }
                ],
                take,
                0,
            );

            tubular.createGridResponse(request, data)
                .then(response => {
                    expect(response.Counter).toBeDefined();
                    expect(response.TotalRecordCount).toBe(totalRecordCount);
                    expect(response.FilteredRecordCount).toBe(filteredCount);
                    expect(response.TotalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.Payload.length).toBe(take);
                    expect(response.AggregationPayload).toBeDefined();
                    expect(response.AggregationPayload.address_id).toBe(1);

                    done();
                });
        });

        it("uses Average", done => {
            const take = 10,
                filteredCount = totalRecordCount;

            let request = new GridRequest(
                [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, SortOrder: 2, ColumnSortDirection: 'Ascending'
                    },
                    {
                        Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true, SortOrder: 3, ColumnSortDirection: 'Ascending'
                    },
                    {
                        Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false, Aggregate: 'Average'
                    }
                ],
                take,
                0,
            );

            tubular.createGridResponse(request, data)
                .then(response => {
                    expect(response.Counter).toBeDefined();
                    expect(response.TotalRecordCount).toBe(totalRecordCount);
                    expect(response.FilteredRecordCount).toBe(filteredCount);
                    expect(response.TotalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.Payload.length).toBe(take);
                    expect(response.AggregationPayload).toBeDefined();
                    expect(response.AggregationPayload.address_id).toBe(25.5);

                    done();
                });
        });

        it("uses Sum", done => {
            const take = 10,
                filteredCount = totalRecordCount;

            let request = new GridRequest(
                [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, SortOrder: 2, ColumnSortDirection: 'Ascending'
                    },
                    {
                        Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true, SortOrder: 3, ColumnSortDirection: 'Ascending'
                    },
                    {
                        Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false, Aggregate: 'Sum'
                    }
                ],
                take,
                0,
            );

            tubular.createGridResponse(request, data)
                .then(response => {
                    expect(response.Counter).toBeDefined();
                    expect(response.TotalRecordCount).toBe(totalRecordCount);
                    expect(response.FilteredRecordCount).toBe(filteredCount);
                    expect(response.TotalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.Payload.length).toBe(take);
                    expect(response.AggregationPayload).toBeDefined();
                    expect(response.AggregationPayload.address_id).toBe(1275);

                    done();
                });
        });

        it("fails due to unknwon aggregate", () => {
            const take = 10;

            let request = new GridRequest(
                [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, SortOrder: 2, ColumnSortDirection: 'Ascending'
                    },
                    {
                        Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true, SortOrder: 3, ColumnSortDirection: 'Ascending'
                    },
                    {
                        Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false, Aggregate: 'Unknown'
                    }
                ],
                take,
                0,
            );

            expect(() => tubular.createGridResponse(request, data)).toThrow("Unsupported aggregate function");
        });
    });
});