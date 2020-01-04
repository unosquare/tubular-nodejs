[![codecov](https://codecov.io/gh/unosquare/tubular-nodejs/branch/master/graph/badge.svg)](https://codecov.io/gh/unosquare/tubular-nodejs)
[![npm version](https://badge.fury.io/js/tubular-nodejs.svg)](https://badge.fury.io/js/tubular-nodejs)

![Tubular Node.js](https://unosquare.github.io/assets/tubular.png)

:star: _Please star this project if you find it useful!_

Tubular Node.js provides an easy way to integrate Tubular Angular Components easily with any WebApi library.

Please visit the [Tubular GitHub Page](http://unosquare.github.io/tubular) to learn how quickly you can start coding. See [Related projects](#related-projects) below to discover more Tubular libraries and backend solutions.

## Installation 

```sh
$ npm install tubular-nodejs --save
```

## Sample

Use the following snippet if you're using [express](https://expressjs.com/) on your backend. That will handle a Tubular Grid request/response with a JSON data connector. You only need a JSON file like the one at [raw file](https://raw.githubusercontent.com/unosquare/tubular/master/test/integration/tbnodejs/public/sources/clients.json).

```js
const express = require("express");
const app = express();

var tbNode = require("tubular-nodejs")("jsondata");
var data = require("/path/to/some/clients.json/file");

app.post("/clients", function(req, res) {
  tbNode.createGridResponse(req.body, data).then(function(response) {
    return res.json(response);
  });
});

app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});
```

Or you can just use the following snippet to use our [Knex.js](http://knexjs.org/) connector.

```js
const express = require("express");
const app = express();

var tbNode = require("tubular-nodejs")("knexjs");
var knex = require("knex")({
  client: "mysql",
  connection: {
    host: "yourhost",
    user: "youruser",
    port: 3306,
    password: "",
    database: "yourdatabase"
  }
});

app.post("/clients", function(req, res) {
  let queryBuilder = knex
    .select("first_name", "last_name", "address_id")
    .from("clients");
  tbNode.createGridResponse(req.body, queryBuilder).then(function(response) {
    return res.json(response);
  });
});

app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});
```

## Related Projects

| Name                                                                                                 | Type            | Language/tech         | Description                                                                                                                                                                       |
| ---------------------------------------------------------------------------------------------------- | --------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |  
| [Tubular React Common](https://github.com/unosquare/tubular-react.common)                     | Library         | React            | React hooks to integrate with any Grid component.                                                                                                   |
| [Tubular React](https://github.com/unosquare/tubular-react)                                          | Library         | React                 | Tubular-React is a DataGrid component using Material-UI                                                                                                                           |
| [Tubular Common](https://github.com/unosquare/tubular-common)                                        | Library         | Javascript/Typescript | Tubular Common provides TypeScript and Javascript models and data transformer to use any Tubular DataGrid component with an array of Javascript objects.                          |
| [Tubular Dotnet](https://github.com/unosquare/tubular-dotnet)                                        | Backend library | C#/.NET Core          | Tubular provides .NET Framework and .NET Core Library to create REST service to use with Tubular Angular Components easily with any WebApi library (ASP.NET Web API for example). |
