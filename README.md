[![Build Status](https://travis-ci.org/unosquare/tubular-nodejs.svg?branch=master)](https://travis-ci.org/unosquare/tubular-nodejs)
[![Coverage Status](https://coveralls.io/repos/github/unosquare/tubular-nodejs/badge.svg?branch=master)](https://coveralls.io/github/unosquare/tubular-nodejs?branch=master)

![Tubular Node.js](http://unosquare.github.io/tubular/assets/tubular.png)

:star: *Please star this project if you find it useful!*

Tubular Node.js provides an easy way to integrate Tubular Angular Components easily with any WebApi library. 

You can also use .NET as backend with [Tubular Dotnet library](https://github.com/unosquare/tubular-dotnet/)

Please visit the <a href="http://unosquare.github.io/tubular" target="_blank">Tubular GitHub Page</a> to learn how quickly you can start coding. Don't forget to check out the Tubular Generator which quickly turns models into an awesome UIs!

## npm Installation [![npm version](https://badge.fury.io/js/tubular-nodejs.svg)](https://badge.fury.io/js/tubular-nodejs)

<pre>
$ npm install tubular-nodejs --save
</pre>

## Sample

You can check out the <a href="http://unosquare.github.io/tubular" target="_blank">Tubular GitHub Page</a> to get a few examples. We still need to work on more samples and better documentation, but we feel what we have now will get you up to speed very quickly :).

Use the following snippet if you're using <a href="https://expressjs.com/" target="_blank">express</a> on your backend. That will handle a Tubular Grid request/response with a JSON data connector. You only need a json file like the one at: https://github.com/unosquare/tubular/blob/master/test/integration/tbnodejs/public/sources/clients.json

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
