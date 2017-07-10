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
});