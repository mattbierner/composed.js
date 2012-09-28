(function(define){

define(function() {
//"use strict";

/* Array Prototype
 ******************************************************************************/
var concat = Array.prototype.concat;
var slice = Array.prototype.slice;
var reduce = Array.prototype.reduce;
var reduceRight = Array.prototype.reduceRight;

/* Helpers
 ******************************************************************************/
var constantUndefined = function() { };

var simpleCompose = function(f, g) {
    return function() {
        return f(g.apply(undefined, arguments));
    };
};

var reduceFuncsLeft = function(funcs, reduction) {
    return function(/*...*/) {
        return reduce.call(funcs, reduction, arguments);
    };
};

var reduceFuncsRight = function(funcs, reduction) {
    return function(/*...*/) {
        return reduceRight.call(funcs, reduction, arguments);
    };
};



/* Factories
 ******************************************************************************/
function wrapReduceFactory(state) {
    return function(p, c) {
        return c.apply(state, p);
    };
}

function wrapReduceExplicitFactory(state) {
    return function(p, c) {
        return c.apply(undefined, concat.apply([state], p));
    };
}

function composeReduceFactory(state) {
    return function(p, c) {
        return [c.apply(state, p)];
    };
}

var chainFactory = function(reducer, factory) {
    return function(state /*, ...wrappers*/) {
        var wrappers = slice.call(arguments, 1);
        return (wrappers.length === 0 ? constantUndefined :
            reducer(wrappers, factory(state)));
    };
};

/* Constants
 ******************************************************************************/
var wrapReduce = wrapReduceFactory(undefined);

var composeReduce = composeReduceFactory(undefined);

var extract = function(v){ return v[0]; };

/* Exported Objects
 ******************************************************************************/
/**
 * Wraps a function in a set of functions that give the function's arguments.
 * 
 * Similar to function composition, except inner functions return the arguments
 * for outer functions. Like composition if Javascript supported multiple return
 * values.
 * 
 * Wrapped function is right to left:
 *     wrap(a, b, c)(x, y) = a(b(c(x, y)))
 * 
 * @param {...function(...args): Array} wrappers Wrapping functions. Wrapped
 *     right to left. Wrapper functions are called with the current set of
 *     arguments for the wrapped function and return an array of arguments.
 * 
 * @return {function} Wrapped function.
 */
var wrap = function(/*...*/) {
    return reduceFuncsRight(arguments, wrapReduce);
};

/**
 * Same as wrap but wraps left to right.
 * 
 * Example:
 *     wrapl(a, b, c)(x, y) = c(b(a(x, y)))
 */
var wrapl = function(/*...*/) {
    return reduceFuncsLeft(arguments, wrapReduce);
};

/**
 * Wraps a function in itself 'count' times.
 * 
 *     wrapIterate(a, 3)(x, y) = a(a(a(x, y)))
 * 
 * @param {function} f Function being wrapped.
 * @param {number} count Number of times to wrap function in itself. If zero,
 *    empty function is returned.
 * 
 * @return {function} Wrapped function.
 */
var wrapIterate = function(f, count) {
    if (count <= 0) {
        return constantUndefined;
    } else if (count === 1) {
        return f;
    } else {
        return wrap(wrapIterate(f, count - 1), f);
    }
};

/**
 * Composes a set of functions.
 * 
 * Composed function is right to left:
 *     compose(a, b, c)(x, y) = a(b(c(x, y)))
 * 
 * @param {...function(...args)} functions Set of composing functions. Composing
 *     functions are called with the return value of the previous function.
 * 
 * @return {function} Composed function.
 */
var compose = function(/*...*/) {
    return simpleCompose(extract, reduceFuncsRight(arguments, composeReduce));
};

/**
 * Same as compose but composes left to right.
 * 
 * Example:
 *     compose(a, b, c)(x, y) = c(b(a(x, y)))
 */
var composel = function(/*...*/) {
    return simpleCompose(extract, reduceFuncsLeft(arguments, composeReduce));
};

/**
 * Composes a function with itself 'count' times.
 * 
 * Example:
 *     composeIterate(a, 3)(x, y) = a(a(a(x, y)))
 * 
 * @param {function} f Function being composed.
 * @param {number} count Number of times to compose function with itself. If zero,
 *    empty function is returned.
 * 
 * @return {function} Composed function.
 */
var composeIterate = function(f, count) {
    if (count <= 0) {
        return constantUndefined;
    } else if (count === 1) {
        return f;
    } else {
        return compose(composeIterate(f, count - 1), f);
    }
};

/**
 * Wraps a chain of functions using an explicit state object when invoking
 * each function.
 * 
 * Wraps right to left
 * 
 * Example:
 *     wrapChain(state, a, b, c)(x, y) =
 *         a.apply(state, b.apply(state, c.apply(state, [x, y])))
 * 
 * @param state State object used when invoking each function. Set to 'this' for
 *     function calls.
 * @param {number} count Number of times to compose function with itself. If zero,
 *     empty function is returned.
 * 
 */
var wrapChain = chainFactory(reduceFuncsRight, wrapReduceFactory);

/**
 * Same as chain but left to right.
 */
var wrapChainl = chainFactory(reduceFuncsLeft, wrapReduceFactory);


/**
 * 
 */
var wrapChainExplicit = chainFactory(reduceFuncsRight, wrapReduceExplicitFactory);

/**
 * 
 */
var composeChain = chainFactory(reduceFuncsRight,composeReduceFactory);

/**
 * 
 */
var composeChainExplicit = chainFactory(reduceFuncsRight, function(state) {
    return function(p, c) {
        return [c.apply(undefined, concat.apply([state], p))];
    };
});


/* Export
 ******************************************************************************/
return {
    'compose': compose,
    'composeChain': composeChain,
    'composeChainExplicit': composeChainExplicit,
    'composeIterate': composeIterate,
    'wrap': wrap,
    'wrapChain': wrapChain,
    'wrapChainExplicit': wrapChainExplicit
};

});

}(
    typeof define !== 'undefined' ? define : function(factory) { composed = factory(); }
));