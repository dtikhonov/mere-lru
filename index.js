'use strict';

/* mere-lru -- a simple implementation without bells-and-whistles.
 *
 * Copyright (c) 2021 Dmitri Tikhonov -- MIT License
 *
 * The elements are stored on a list and referenced from a Map.  When an
 * element is accessed via get() or set(), it is moved to the head of the
 * list.  Overflow elements are dropped from tail.
 *
 * Each element of the list is a four-element array.  We need to keep
 * the key to be able to delete evicted elements from the map.
 */

const NEXT = 0, PREV = 1, KEY = 2, VALUE = 3;

function list_insert_head (head, el)
{
    let next;

    next = head[NEXT];
    if (next)
    {
        next[PREV] = el;
        el[NEXT] = next;
        head[NEXT] = el;
        el[PREV] = head;
    }
    else
    {
        head[NEXT] = head[PREV] = el;
        el[PREV] = el[NEXT] = head;
    }
}

function list_drop_tail (head)
{
    let el, prev;

    /* At this point, the list has at least 2 elements */
    el = head[PREV];
    prev = el[PREV];
    prev[NEXT] = head;
    head[PREV] = prev;

    return el;
}

function list_move_to_front (head, el)
{
    let next, prev;

    if (head[NEXT] !== el)
    {
        next = el[NEXT];
        prev = el[PREV];
        prev[NEXT] = next;
        next[PREV] = prev;

        list_insert_head(head, el);
    }
}

class MereLRU
{
    constructor (maxSize)
    {
        if (!maxSize || maxSize < 2)
            throw new Error('maximum size should be larger than 1');

        this.mlru_max_size = maxSize;
        this.mlru_map = new Map;
        this.mlru_list = [ null, null ];
    }

    set (key, val)
    {
        let el, victim;

        if (this.mlru_map.has(key))
        {
            el = this.mlru_map.get(key);
            el[VALUE] = val;
            list_move_to_front(this.mlru_list, el);
        } 
        else
        {
            el = [ null, null, key, val ];
            list_insert_head(this.mlru_list, el);
            this.mlru_map.set(key, el);
            if (this.mlru_map.size > this.mlru_max_size)
            {
                victim = list_drop_tail(this.mlru_list);
                this.mlru_map.delete(victim[KEY]);
            }
        }

        return this;
    }

    get (key)
    {
        let el;

        if (this.mlru_map.has(key))
        {
            el = this.mlru_map.get(key);
            list_move_to_front(this.mlru_list, el);
            return el[VALUE];
        }
    }

    has (key)
    {
        return this.mlru_map.has(key);
    }
}

module.exports = MereLRU;
