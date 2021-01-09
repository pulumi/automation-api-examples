[![Build Status](https://travis-ci.com/pulumi/pulumi-query.svg?token=eHg7Zp5zdDDJfTjY8ejq&branch=master)](https://travis-ci.com/pulumi/pulumi-query)

# query.js

query.js makes it easy to write _SQL-like queries_ over _JavaScript data structures_. It supports
`Array`, `Set`, `Map`, and `Object`, as well as `Iterable` more generally. Unlike other query
libraries, query.js has strong support for `Promise`, and is considerably easier to understand and
write than streaming query models such as RxJS.

## Installing

This package is available in JavaScript/TypeScript for use with Node.js.  Install it using either `npm`:

    $ npm install @pulumi/query

or `yarn`:

    $ yarn add @pulumi/query

[linq]: https://en.wikipedia.org/wiki/Language_Integrated_Query
