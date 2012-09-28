# composed.js - Javascript Function Composition Library #

## About ##
composed.js is a small library for composing functions in Javascript. It includes
functions for multiple function composition, multiple function wrapping,
function iteration, and multiple function chaining. Both left to right and
right to left versions of most functions are provided.

    // Compose right to left
    var f = composed.compose(double, increment, increment);
    f(1); -> 6
    
    // Compose left to right
    var g = composed.composel(double, increment, increment);
    g(1); -> 4
    
    // Chaining left to right:
    var m = composed.chainl({ x:1, y:2 },
        function(v) { return v * this.y ;},
        function(v) { return v + this.x ;});
    m(1); -> 3
    
    // Function Iteration
    var n = composed.composeIterate(increment, 10);
    n(1); -> 11

# Using Composed.js #
Composed.js can be used either as an AMD style module or in the global scope.

## With AMD ##
Include any AMD style module loader and load composed:

    <!DOCTYPE html>
    <html>
    <head></head>
    <body>
        <script type="application/javascript" src="require.js"></script>
        <script type="application/javascript">
            require(['composed'], function(composed) {
                var f = composed.compose(...);
            });
        </script>
    </body>

## Global ##
Include composed.js file directly and use 'composed' global:

    <!DOCTYPE html>
    <html>
    <head></head>
    <body>
        <script type="application/javascript" src="composed.js"></script>
        <script type="application/javascript">
            var f = composed.compose(...);
        </script>
    </body>


# API #
Overview of API and examples. More detailed documentation can be found in the code.

All default functions evaluate right to left. Left to right versions use the 
same name followed by an 'l'.

## compose(...function(...args): Array) ##
Composes a set of functions right to left.

    compose(a, b, c)(x, y); -> a(b(c(x, y)))
    
    var f = composed.compose(double, increment, increment);
    f(1); -> 6 

## composel(...function(...args): Array) ##
Same as 'compose' but left to right.

    composel(a, b, c)(x, y); -> c(b(a(x, y)))
    
    var f = composed.composel(double, increment, increment);
    f(1); -> 4

## composeIterate(f: function(...), count: number) ##
Composes a function 'f' with itself 'count' times.

    composeIterate(f, 3)(x, y); -> f(f(f(x, y)))
    
    var f = composed.composeIterate(increment, 10);
    f(1); -> 11

## wrap(...function(...args): Array) ##
Wraps a set of functions. Each wrapped function gives next function's arguments.
Wraps right to left. Like composition if Javascript supported multiple return
values.

    wrap(a, b, c)(x, y); -> a.apply(undefined, b.apply(undefined, c(x, y)))

    // Return calling arguments as array.
    function args(){
        return Array.prototype.map.call(arguments, function(e) { return e; });
    }
    
    var f = composed.wrap(args, increment, double);
    f(1, 2, 3) -> [3, 5, 7]

## wrapl(...function(...): Array) ##
Same as 'wrap' but left to right.

    wrapl(a, b, c)(x, y); -> c.apply(undefined, b.apply(undefined, a(x, y)))
    
    var f = composed.wrapl(double, increment, args);
    f(1, 2, 3) -> [3, 5, 7]

## wrapIterate(f: function(...), count: number) ##
Wraps a function 'f' with itself 'count' times.

    wrapIterate(f, 3)(x, y); -> f.apply(undefined, f.apply(undefined, f(x, y)))
    
    var f = composed.composeIterate(function(v){ return [v + 1]; }, 10);
    f(1); -> [11]

## composeChain(state: object, ...function(...)) ##
Composes a chain of functions using an explicit state object when invoking each
function. Composes right to left. 'state' is set to 'this' when invoking
composed functions.

    composeChain(state, a, b, c)(x, y) =
        a.apply(state, [b.apply(state, [c.apply(state, [x, y])])])

## composeChainl(state: object, ...function(...)) ##
Same as 'composeChain' but left to right.

## composeChainExplicit(state: object, ...function(...)) ##
Same as 'composeChain' but each function takes a state first argument and 'this'
is not modified. 

    composeChainExplicit(state, a, b, c)(x, y) =
        a.apply(undefined, [state, b.apply(undefined, [state, c.apply(undefined, [state, x, y])])])
        
## composeChainExplicitl(state: object, ...function(...)) ##
Same as 'composeChainExplicit' but left to right.


## wrapChain(state: object, ...function(...)) ##
Wraps a chain of functions using an explicit state object when invoking each
function. Wraps right to left. 'state' is set to 'this' when invoking
wrapped functions.

    wrapChain(state, a, b, c)(x, y) =
        a.apply(state, b.apply(state, c.apply(state, [x, y])))

## wrapChainl(state: object, ...function(...)) ##
Same as 'wrapChain' but left to right.

## wrapChainExplicit(state: object, ...function(...)) ##
Same as 'wrapChain' but each function takes a state first argument and 'this'
is not modified. 

    composeChainExplicit(state, a, b, c)(x, y) =
        a.apply(undefined, [state] + b.apply(undefined, [state] + c.apply(undefined, [state, x, y])))
        
## wrapChainExplicitl(state: object, ...function(...)) ##
Same as 'wrapChainExplicit' but left to right.


