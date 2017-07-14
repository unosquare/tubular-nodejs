var tubular = require('../tubular')('jsondata');
var data = require('../../spec/data/jsondata.json');
var GridDataRequest = require('../grid-data-request');
var CompareOperator = require('../compare-operator');

describe("jsondata connector", function () {

    describe("Search and Filter", function () {

        it(" use free text search", done => {
            const skip = 0,
                take = 10,
                filteredCount = 2,
                totalRecordCount = 50;

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
            const skip = 0,
                take = 10,
                filteredCount = 1,
                totalRecordCount = 50;

            let request = new GridDataRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, Filter: {
                            Name: '',
                            Text: 'ucy',
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
            const skip = 0,
                take = 10,
                filteredCount = 1,
                totalRecordCount = 50;

            let request = new GridDataRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, Filter: {
                            Name: '',
                            Text: 'Merrick',
                            Argument: [],
                            Operator: CompareOperator.equals,
                            HasFilter: false
                        }
                    },
                    {
                        Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true, Filter: {
                            Name: '',
                            Text: 'Probart',
                            Argument: [],
                            Operator: CompareOperator.equals,
                            HasFilter: false
                        }
                    },
                    { Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false }
                ],
                Search: {
                    Name: '',
                    Text: 'rr',
                    Argument: [],
                    Operator: CompareOperator.auto,
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
        it("filters using Equals", done => {
            const skip = 0,
                take = 10,
                filteredCount = 1,
                totalRecordCount = 50;

            let request = new GridDataRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, Filter: {
                            Name: '',
                            Text: 'Ignacius',
                            Argument: [],
                            Operator: CompareOperator.equals,
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

        it("filters using NotEquals", done => {
            const skip = 0,
                take = 10,
                filteredCount = 49,
                totalRecordCount = 50;

            let request = new GridDataRequest({
                Skip: skip,
                Take: take,
                Counter: 1,
                Columns: [
                    {
                        Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, Filter: {
                            Name: '',
                            Text: 'Ignacius',
                            Argument: [],
                            Operator: CompareOperator.notEquals,
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

        it("filters using Contains", done => {
            const skip = 0,
                take = 10,
                filteredCount = 2,
                totalRecordCount = 50;

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
            const skip = 0,
                take = 10,
                filteredCount = 48,
                totalRecordCount = 50;

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
            const skip = 0,
                take = 10,
                filteredCount = 3,
                totalRecordCount = 50;

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
            const skip = 0,
                take = 10,
                filteredCount = 47,
                totalRecordCount = 50;

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
            const skip = 0,
                take = 10,
                filteredCount = 2,
                totalRecordCount = 50;

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
            const skip = 0,
                take = 10,
                filteredCount = 48,
                totalRecordCount = 50;

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
            const skip = 0,
                take = 10,
                filteredCount = 2,
                totalRecordCount = 50;

            let request = new GridDataRequest({
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
                            Operator: CompareOperator.gte,
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

        it("filters using Gt", done => {
            const skip = 0,
                take = 10,
                filteredCount = 1,
                totalRecordCount = 50;

            let request = new GridDataRequest({
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
                            Operator: CompareOperator.gt,
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

        it("filters using Lte", done => {
            const skip = 0,
                take = 10,
                filteredCount = 2,
                totalRecordCount = 50;

            let request = new GridDataRequest({
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
                            Operator: CompareOperator.lte,
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

        it("filters using Lt", done => {
            const skip = 0,
                take = 10,
                filteredCount = 1,
                totalRecordCount = 50;

            let request = new GridDataRequest({
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
                            Operator: CompareOperator.lt,
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

        it("filters using Between", done => {
            const skip = 0,
                take = 10,
                filteredCount = 48,
                totalRecordCount = 50;

            let request = new GridDataRequest({
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
                            Operator: CompareOperator.between,
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

        it("fails due to unknwon Compare Operator", () => {
            const skip = 0,
                take = 10,
                filteredCount = 48,
                totalRecordCount = 50;

            let request = new GridDataRequest({
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

        it("sorts by default column", done => {
            const skip = 0,
                take = 10,
                filteredCount = 50,
                totalRecordCount = 50;

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

        it("sorts by default column and go to page 2", done => {
            const skip = 10,
                take = 10,
                filteredCount = 50,
                totalRecordCount = 50;

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
            const skip = 0,
                take = 10,
                filteredCount = 50,
                totalRecordCount = 50;

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
            const skip = 0,
                take = 10,
                filteredCount = 50,
                totalRecordCount = 50;

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
        it("uses Count", done => {
            const skip = 0,
                take = 10,
                filteredCount = 50,
                totalRecordCount = 50;

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
            const skip = 0,
                take = 10,
                filteredCount = 50,
                totalRecordCount = 50;

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

        it("uses Max", done => {
            const skip = 0,
                take = 10,
                filteredCount = 50,
                totalRecordCount = 50;

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
            const skip = 0,
                take = 10,
                filteredCount = 50,
                totalRecordCount = 50;

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
            const skip = 0,
                take = 10,
                filteredCount = 50,
                totalRecordCount = 50;

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

        it("uses Sum", done => {
            const skip = 0,
                take = 10,
                filteredCount = 50,
                totalRecordCount = 50;

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
            const skip = 0,
                take = 10,
                filteredCount = 50,
                totalRecordCount = 50;

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

            expect(() => tubular.createGridResponse(request, data)).toThrow("Unsupported aggregate function");
        });
    });
});