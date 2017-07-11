var tubular = require('../tubular')('jsondata');
var data = require('../../spec/data/jsondata.json');

describe("jsondata connector", function () {
    it(" use free text search", done => {
        const skip = 0,
            take = 10,
            filteredCount = 2,
            totalRecordCount = 50;

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

        let request = {
            Skip: skip,
            Take: take,
            Counter: 1,
            Columns: [
                {
                    Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, Filter: {
                        Name: '',
                        Text: 'ucy',
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

        let request = {
            Skip: skip,
            Take: take,
            Counter: 1,
            Columns: [
                {
                    Name: 'first_name', Label: 'First Name', Sortable: true, Searchable: true, Filter: {
                        Name: '',
                        Text: 'Merrick',
                        Argument: [],
                        Operator: 'Equals',
                        HasFilter: false
                    }
                },
                {
                    Name: 'last_name', Label: 'Last Name', Sortable: true, Searchable: true, Filter: {
                        Name: '',
                        Text: 'Probart',
                        Argument: [],
                        Operator: 'Equals',
                        HasFilter: false
                    }
                },
                { Name: 'address_id', Label: 'Address Id', Sortable: true, Searchable: false }
            ],
            Search: {
                Name: '',
                Text: 'rr',
                Argument: [],
                Operator: 'Auto',
                HasFilter: false
            }
        };

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

    it(" sorts by default column", done => {
        const skip = 0,
            take = 10,
            filteredCount = 50,
            totalRecordCount = 50;

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

    it(" sorts by default column and go to page 2", done => {
        const skip = 10,
            take = 10,
            filteredCount = 50,
            totalRecordCount = 50;

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

    it(" sorts by specific column", done => {
        const skip = 0,
            take = 10,
            filteredCount = 50,
            totalRecordCount = 50;

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

    it(" sorts by TWO columns", done => {
        const skip = 0,
            take = 10,
            filteredCount = 50,
            totalRecordCount = 50;

        let request = {
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
        };

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