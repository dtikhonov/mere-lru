'use strict';

const t= require('tap');
const MereLRU = require('../index.js');

t.test('constructor error', t => {
    t.throws(function () { new MereLRU; });
    t.end();
});

t.test('basic get/set/has test', t => {
    const lru = new MereLRU(10);
    lru.set('a', 10);
    lru.set('b', 20);
    t.ok(lru.has('a'));
    t.ok(lru.get('a') === 10);
    t.ok(lru.has('b'));
    t.ok(lru.get('b') === 20);
    t.notOk(lru.has('c'));
    t.equal(lru.get('c'), undefined);
    t.end();
});

t.test('lru test', t => {
    const lru = new MereLRU(4);

    /* Basic eviction */
    lru.set('a', 0);
    lru.set('b', 1);
    lru.set('c', 2);
    lru.set('d', 3);
    lru.set('e', 4);
    t.notOk(lru.has('a'));
    t.ok(lru.has('b'));
    t.ok(lru.has('c'));
    t.ok(lru.has('d'));
    t.ok(lru.has('e'));

    /* `get' moves item to head */
    lru.get('b');
    lru.get('b'); // Cover branch in list_move_to_front()
    lru.set('f');
    t.ok(lru.has('b'));
    t.notOk(lru.has('c'));
    t.ok(lru.has('d'));
    t.ok(lru.has('e'));
    t.ok(lru.has('f'));

    /* `set' moves item to head */
    lru.set('d', 7);
    lru.set('g', 8);
    t.ok(lru.has('b'));
    t.notOk(lru.has('e'));
    t.ok(lru.has('d'));
    t.ok(lru.has('g'));
    t.ok(lru.has('f'));

    t.end();
});

t.test('test README example', t => {
    // Insert stuff
    const cache = new MereLRU(100);
    cache.set('key', 'value');
    t.equals(cache.get('key'), 'value');

    // Insert more elements
    for (let i = 0; i < 100; ++i)
        cache.set('key' + i, 'foo');

    // The first one is now gone:
    t.notOk(cache.has('key'));

    t.end();
});
