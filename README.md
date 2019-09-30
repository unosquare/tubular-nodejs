[![Build Status](https://travis-ci.org/unosquare/tubular-nodejs.svg?branch=master)](https://travis-ci.org/unosquare/tubular-nodejs)
[![Coverage Status](https://coveralls.io/repos/github/unosquare/tubular-nodejs/badge.svg?branch=master)](https://coveralls.io/github/unosquare/tubular-nodejs?branch=master)

![Tubular Node.js](http://unosquare.github.io/tubular-angular/assets/tubular.png)

:star: *Please star this project if you find it useful!*

Tubular Node.js provides an easy way to integrate Tubular Angular Components easily with any WebApi library. 

Please visit the [Tubular GitHub Page](http://unosquare.github.io/tubular) to learn how quickly you can start coding. See [Related projects](#related-projects) below to discover more Tubular libraries and backend solutions.

## Installation [![npm version](https://badge.fury.io/js/tubular-nodejs.svg)](https://badge.fury.io/js/tubular-nodejs)

```sh
$ npm install tubular-nodejs --save
```

## Sample

You can check out the <a href="http://unosquare.github.io/tubular" target="_blank">Tubular GitHub Page</a> to get a few examples. We still need to work on more samples and better documentation, but we feel what we have now will get you up to speed very quickly :).

Use the following snippet if you're using <a href="https://expressjs.com/" target="_blank">express</a> on your backend. That will handle a Tubular Grid request/response with a JSON data connector. You only need a JSON file like the one at https://github.com/unosquare/tubular/blob/master/test/integration/tbnodejs/public/sources/clients.json

```js
const express = require('express');
const app = express();

var tbNode = require('tubular-nodejs')('jsondata');
var data = require('/path/to/some/clients.json/file');

app.post('/clients', function (req, res) {
  tbNode.createGridResponse(req.body, data).then(function(response){
    return res.json(response);
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
```

Or you can just use the following snippet to use our <a href="http://knexjs.org/">Knex.js</a> connector.

```js
const express = require('express');
const app = express();

var tbNode = require('tubular-nodejs')('knexjs');
var knex = require('knex')({
    client: 'mysql',
    connection: {
        host: 'yourhost',
        user: 'youruser',
        port: 3306,
        password: '',
        database: 'yourdatabase'
    }
});

app.post('/clients', function (req, res) {
  let queryBuilder = knex.select('first_name', 'last_name', 'address_id').from('clients');
  tbNode.createGridResponse(req.body, queryBuilder).then(function(response){
    return res.json(response);
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
```

## Related Projects

Name | Type | Language/tech | Description
-----|------|---------------|--------------
| [Tubular for AngularJS (formerly Tubular)](https://github.com/unosquare/tubular) | Library | AngularJs | Tubular provides a set of directives and services using AngularJS as framework. |
| [Tubular for Angular6 (formerly Tubular2)](https://github.com/unosquare/tubular2) | Library | Angular6 | New Tubular2 with Angular6 (Angular2) and Angular Material 2.
| [Tubular React](https://github.com/unosquare/tubular-react) | Library | React | Tubular-React is a DataGrid component using Material-UI |
| [Tubular Common](https://github.com/unosquare/tubular-common) | Library | Javascript/Typescript | Tubular Common provides TypeScript and Javascript models and data transformer to use any Tubular DataGrid component with an array of Javascript objects. |
| [Tubular Dotnet](https://github.com/unosquare/tubular-dotnet) | Backend library | C#/.NET Core | Tubular provides .NET Framework and .NET Core Library to create REST service to use with Tubular Angular Components easily with any WebApi library (ASP.NET Web API for example). |
| [Tubular Nodejs](https://github.com/unosquare/tubular-nodejs) | Backend Library | Javascript | Tubular Node.js provides an easy way to integrate Tubular Angular Components easily with any Node.js WebApi library. |
| [Tubular Boilerplate C#](https://github.com/unosquare/tubular-boilerplate-csharp) | Boilerplate | C# | Tubular Directives Boilerplate (includes AngularJS and Bootstrap) |
| [Tubular Boilerplate](https://github.com/unosquare/tubular-boilerplate) | Boilerplate | Javascript/AngularJS | Tubular Directives Boilerplate (includes AngularJS and Bootstrap). |
| [Tubular ASP.NET Core 2.0 Boilerplate](https://github.com/unosquare/tubular-aspnet-core-boilerplate) | Boilerplate | C#/.NET Core | Tubular Directives Boilerplate (includes AngularJS and Bootstrap). |
