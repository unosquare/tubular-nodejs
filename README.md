[![Build Status](https://travis-ci.org/unosquare/tubular-nodejs.svg?branch=master)](https://travis-ci.org/unosquare/tubular-nodejs)
[![Coverage Status](https://coveralls.io/repos/github/unosquare/tubular-nodejs/badge.svg?branch=master)](https://coveralls.io/github/unosquare/tubular-nodejs?branch=master)

![Tubular Node.js](http://unosquare.github.io/tubular/assets/tubular.png)

:star: *Please star this project if you find it useful!*

Tubular Node.js provides an easy way to integrate Tubular Angular Components easily with any WebApi library. 

Please visit the <a href="http://unosquare.github.io/tubular" target="_blank">Tubular GitHub Page</a> to learn how quickly you can start coding. Don't forget to check out the Tubular Generator which quickly turns models into an awesome UIs!

## Sample

You can check out the <a href="http://unosquare.github.io/tubular" target="_blank">Tubular GitHub Page</a> to get a few examples. We still need to work on more samples and better documentation, but we feel what we have now will get you up to speed very quickly :).

The following code represents a basic <a href="https://expressjs.com/" target="_blank">express</a> web api using tubular 
with <a href="http://knexjs.org/" target="_blank">KnexJS</a> as a connector.

```js
const express = require('express')
const app = express()
const tubular = require('tubular')

var knex = require('knex')({
    client: 'mysql',
    connection: {
        host: 'localhost',
        user: 'someuser',
        port: 3306,
        password: '',
        database: 'sakila'
    }
});

app.post('/clients', function (req, res) {

  // Create the initial query using knex
  let knexQuery = knex.select('first_name', 'last_name', 'address_id').from('customer');
  
  // Create the response using tubular
  res.send(tubular.createGridResponse(req, knexQuery))
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
```
