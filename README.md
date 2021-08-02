# mere-lru
A simple LRU for NodeJS

## Introduction

This library implements an LRU Cache.  It has only three methods: `get()`, `set()`, and `has()` and possesses the following traits:
- simplicity
- correctness
- uses [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) rather than `Object`.

The reason I wrote it is that, at the time of this writing, I could not find a library that would satisfy all three requirements above.

## Usage

```javascript
// Import the class
const MereLRU = require('mere-lru');

// Insert stuff
const cache = new MereLRU(100);
cache.set('key', 'value');
const v = cache.get('key'); // -> 'value'

// Insert more elements
for (let i = 0; i < 100; ++i)
    cache.set('key' + i, 'foo');

// The first one is now gone:
cache.has('key'); // -> false
```

## References

A good collection of related modules is here:
https://github.com/dominictarr/bench-lru

(But take the benchmark results on that page with a barrel of salt.)
