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

        xit(" use free text search", done => {
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

        xit(" filters by one column", done => {
            const skip = 0,
                take = 10,
                filteredCount = 1;

            let request = new GridRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
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
                Search: {
                    Name: '',
                    Text: 'GEO',
                    Argument: [],
                    Operator: CompareOperators.AUTO,
                    HasFilter: false
                }
            });

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

        xit(" combines search and filter", done => {
            const skip = 0,
                take = 10,
                filteredCount = 1;

            let request = new GridRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
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
                Search: {
                    Name: '',
                    Text: 'rr',
                    Argument: [],
                    Operator: CompareOperators.AUTO,
                    HasFilter: false
                }
            });

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
        xit("filters using Equals", done => {
            const skip = 0,
                take = 10,
                filteredCount = 1;

            let request = new GridRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
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
                ]
            });

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

        xit("filters using NotEquals", done => {
            const skip = 0,
                take = 10,
                filteredCount = 49;

            let request = new GridRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
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
                ]
            });

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

        xit("filters using Contains", done => {
            const skip = 0,
                take = 10,
                filteredCount = 2;

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

        xit("filters using NotContains", done => {
            const skip = 0,
                take = 10,
                filteredCount = 48;

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

        xit("filters using StartsWith", done => {
            const skip = 0,
                take = 10,
                filteredCount = 3;

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

        xit("filters using NotStartsWith", done => {
            const skip = 0,
                take = 10,
                filteredCount = 47;

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

        xit("filters using EndsWith", done => {
            const skip = 0,
                take = 10,
                filteredCount = 2;

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

        xit("filters using NotEndsWith", done => {
            const skip = 0,
                take = 10,
                filteredCount = 48;

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
                        Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false, Filter: {
                            Name: '',
                            Text: 49,
                            Argument: [],
                            Operator: CompareOperators.GTE,
                            HasFilter: false
                        }
                    }
                ]
            });

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
                        Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false, Filter: {
                            Name: '',
                            Text: 49,
                            Argument: [],
                            Operator: CompareOperators.GT,
                            HasFilter: false
                        }
                    }
                ]
            });

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
                        Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false, Filter: {
                            Name: '',
                            Text: 2,
                            Argument: [],
                            Operator: CompareOperators.LTE,
                            HasFilter: false
                        }
                    }
                ]
            });

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
                        Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false, Filter: {
                            Name: '',
                            Text: 2,
                            Argument: [],
                            Operator: CompareOperators.LT,
                            HasFilter: false
                        }
                    }
                ]
            });

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

        xit("filters using Between", done => {
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
                        Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false, Filter: {
                            Name: '',
                            Text: 1,
                            Argument: [50],
                            Operator: CompareOperators.BETWEEN,
                            HasFilter: false
                        }
                    }
                ]
            });

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
                        Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false, Filter: {
                            Name: '',
                            Text: 1,
                            Argument: [50],
                            Operator: 'Unknown',
                            HasFilter: false
                        }
                    }
                ]
            });

            expect(() => tubular.createGridResponse(request, data)).toThrow("Unsupported Compare Operator");
        });
    });

    describe("Sort", function () {

        xit("sorts by default column", done => {
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
                        Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false
                    }
                ]
            });

            tubular.createGridResponse(request, data)
                .then(response => {
                    expect(response.Counter).toBeDefined();
                    expect(response.TotalRecordCount).toBe(totalRecordCount);
                    expect(response.FilteredRecordCount).toBe(filteredCount);
                    expect(response.TotalPages).toBe(Math.ceil(filteredCount / take));
                    expect(response.Payload.length).toBe(take);
                    expect(response.Payload[0][0]).toBe('Abramo');
                    done();
                });
        });

        xit("sorts by default column and go to page 2", done => {
            const skip = 10,
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
                        Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false
                    }
                ]
            });

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

        xit("sorts by specific column", done => {
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
                        Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true, SortOrder: 2, ColumnSortDirection: 'Ascending'
                    },
                    {
                        Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false
                    }
                ]
            });

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

        xit("sorts by TWO columns", done => {
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
                    }
                ]
            });

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
                        Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false
                    },
                    {
                        Name: 'is_active', Label: 'Is Active', Sortable: true, Searchable: false, Aggregate: 'DistinctCount'
                    }
                ]
            });

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
                        Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false, Aggregate: 'Max'
                    }
                ]
            });

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
                        Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false, Aggregate: 'Min'
                    }
                ]
            });

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
                        Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false, Aggregate: 'Average'
                    }
                ]
            });

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
                        Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false, Aggregate: 'Sum'
                    }
                ]
            });

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

        xit("fails due to unknwon aggregate", () => {
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
                        Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false, Aggregate: 'Unknown'
                    }
                ]
            });

            expect(() => tubular.createGridResponse(request, data)).toThrow("Unsupported aggregate function");
        });
    });
});