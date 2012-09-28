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

function composeReduceFactory(state) {
    return function(p, c) {
        return [c.apply(state, p)];
    };
}

var wrapFactory = function(factory) {
    return function(state /*, ...wrappers*/) {
        var wrappers = slice.call(arguments, 1);
        return (wrappers.length === 0 ? constantUndefined :
            reduceFuncsLeft(wrappers, factory(state)));
    };
};

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
 * @param {function} f Function being wrapped.
 * @param {...function(...args): Array} wrappers Wrapping functions. Wrapped
 *     right to left. Wrapper functions are called with the current set of
 *     arguments for the wrapped function and return an array of arguments.
 * 
 * @return {function} Wrapped function.
 */
var wrap = (function(){
    var reduce = wrapReduceFactory(undefined);
    
    return function(/*...*/) {
        return reduceFuncsRight(arguments, reduce);
    };
}());

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
var compose = (function(){
    var reduce = composeReduceFactory(undefined);
    var extract = function(v){ return v[0]; };
    
    return function(/*...*/) {
        return simpleCompose(extract, reduceFuncsRight(arguments, reduce));
    };
}());

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
 * 
 */
var wrapChain = wrapFactory(wrapReduceFactory);

/**
 * 
 */
var wrapChainExplicit = wrapFactory(function(state) {
    return function(p, c) {
        return c.apply(undefined, concat.apply([state], p));
    };
});

/**
 * 
 */
var composeChain = wrapFactory(composeReduceFactory);

/**
 * 
 */
var composeChainExplicit = wrapFactory(function(state) {
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