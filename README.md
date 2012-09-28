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
    
    assert.equal(g(0), 3);
    assert.deepEqual(state, [0, 1, 2]);
    
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
Same as compose but left to right.

    composel(a, b, c)(x, y); -> c(b(a(x, y)))
    
    var f = composed.composel(double, increment, increment);
    f(1); -> 4

## composeIterate(f: function, count: number) ##
Composes a function 'f' with itself 'count' times.

    composeIterate(f, 3)(x, y); -> f(f(f(x, y)))
    
    var f = composed.composeIterate(increment, 10);
    f(1); -> 11

## wrap(...function(...args): Array) ##
Wraps a function in a set of functions that give the function's arguments.
Like composition if Javascript supported multiple return values.

    // Return calling arguments as array.
    function args(){
        return Array.prototype.map.call(arguments, function(e) { return e; });
    }
    
    // Increment calling arguments and return array.
    function inc(){
        return Array.prototype.map.call(arguments, function(e) { return e + 1; });
    }
    
    // Multiply calling arguments by two and return array.
    function mul(){
        return Array.prototype.map.call(arguments, function(e) { return e * 2; });
    }
    
    var wrapped = callable.wrap(args, inc, mul);
    wrapped(1, 2, 3) -> [3, 5, 7]
