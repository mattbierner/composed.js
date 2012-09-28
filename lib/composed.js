(function(define){

define(function() {
"use strict";

/* Array Prototype
 ******************************************************************************/
var concat = Array.prototype.concat;
var slice = Array.prototype.slice;
var reduce = Array.prototype.reduce;
var reduceRight = Array.prototype.reduceRight;

/* Helpers
 ******************************************************************************/
var constantUndefined = function() { };

var extract = function(v) { return v[0]; };
var bundle = function(v) { return [v]; };

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
var wrapReduceFactory = function(state) {
    return function(p, c) {
        return c.apply(state, p);
    };
};

var wrapReduceExplicitFactory = function(state) {
    return function(p, c) {
        return c.apply(undefined, concat.apply([state], p));
    };
};

var composeReduceFactory = function(state) {
    return simpleCompose(bundle, wrapReduceFactory(state));
};

var composeReduceExplicitFactory = function(state) {
    return simpleCompose(bundle, wrapReduceExplicitFactory(state));
};

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
 * @param {...function} Functions being wrapped.
 * 
 * @return {function} Wrapped function.
 */
var wrapChain = chainFactory(reduceFuncsRight, wrapReduceFactory);

/**
 * Same as 'chain' but left to right.
 */
var wrapChainl = chainFactory(reduceFuncsLeft, wrapReduceFactory);

/**
 * Same as 'wrapChain' except that state is passed as explicit first argument to
 * each function. 'this' is not changed when invoking the function.
 * 
 * Wrapped functions should not return state as one of the passed arguments,
 * the explicit state argument will be bound automatically.
 * 
 * Example:
 *     wrapChain(state, a, b, c)(x, y) =
 *         a.apply(undefined, b.apply(undefined, c.apply(undefined, [state, x, y])))
 */
var wrapChainExplicit = chainFactory(reduceFuncsRight, wrapReduceExplicitFactory);

/**
 * Same as 'wrapChainExplicit' but left to right.
 */
var wrapChainExplicitl = chainFactory(reduceFuncsRight, wrapReduceExplicitFactory);

/**
 * Composes a chain of functions using an explicit state object when invoking
 * each function.
 * 
 * Composes right to left
 * 
 * Example:
 *     composeChain(state, a, b, c)(x, y) =
 *         a.apply(state, b.apply(state, c.apply(state, [x, y])))
 * 
 * @param state State object used when invoking each function. Set to 'this' for
 *     function calls.
 * @param {...function} Functions being composed.
 * 
 * @return {function} Composed function.
 */
var composeChain = chainFactory(reduceFuncsRight, composeReduceFactory);

/**
 * Same as 'composeChain' but left to right.
 */
var composeChainl = chainFactory(reduceFuncsLeft, composeReduceFactory);

/**
 * Same as 'composeChain' except that state is passed as explicit first argument
 * to each function. 'this' is not changed when invoking the function.
 * 
 * Composed functions should not return state as one of the passed arguments,
 * the explicit state argument will be bound automatically.
 * 
 * Example:
 *     wrapChain(state, a, b, c)(x, y) =
 *         a.apply(undefined, b.apply(undefined, c.apply(undefined, [state, x, y])))
 */
var composeChainExplicit = chainFactory(reduceFuncsRight, composeReduceExplicitFactory);

/**
 * Same as 'composeChainExplicit' but left to right.
 */
var composeChainExplicitl = chainFactory(reduceFuncsLeft, composeReduceExplicitFactory);

/* Export
 ******************************************************************************/
return {
    'compose': compose,
    'composel': composel,
    
    'composeChain': composeChain,
    'composeChainl': composeChainl,
    
    'composeChainExplicit': composeChainExplicit,
    'composeChainExplicitl': composeChainExplicitl,
    
    'composeIterate': composeIterate,
    
    'wrap': wrap,
    'wrapl': wrapl,
    
    'wrapChain': wrapChain,
    'wrapChainl': wrapChainl,
    
    'wrapChainExplicit': wrapChainExplicit,
    'wrapChainExplicitl': wrapChainExplicitl,
    
    'wrapIterate': wrapIterate
};

});

}(
    typeof define !== 'undefined' ? define : function(factory) { composed = factory(); }
));