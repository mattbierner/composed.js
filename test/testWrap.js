define(['composed'], function(composed){
    
    function toArgs(){ return Array.prototype.map.call(arguments, function(e) { return e; }); }
    
    function inc(){
        return Array.prototype.map.call(arguments, function(e) { return e + 1; });
    }
    
    function mul(){
        return Array.prototype.map.call(arguments, function(e) { return e * 2; });
    }
    
    return {
        'module': "Wrap Tests",
        'tests': [
            ["Simple wrap",
            function(){
                var wrapped = composed.wrap(toArgs, inc);
                
                assert.deepEqual(wrapped(1, 2, 3), [2, 3, 4]);
            }],
            ["Simple wrapl",
            function(){
                var wrapped = composed.wrapl(inc, toArgs);
                
                assert.deepEqual(wrapped(1, 2, 3), [2, 3, 4]);
            }],
            ["Multiple wrap",
            function(){
                var one = composed.wrap(toArgs, inc, mul);
                var two = composed.wrap(toArgs, mul, inc);
                
                assert.deepEqual(one(1, 2, 3), [3, 5, 7]);
                assert.deepEqual(two(1, 2, 3), [4, 6, 8]);
            }],
            ["Multiple wrapl",
            function(){
                var one = composed.wrapl(mul, inc, toArgs);
                var two = composed.wrapl(inc, mul, toArgs);
                
                assert.deepEqual(one(1, 2, 3), [3, 5, 7]);
                assert.deepEqual(two(1, 2, 3), [4, 6, 8]);
            }],
            ["Multiple wrap",
            function(){
                var oneM = composed.wrap(toArgs, inc, mul);
                var oneN = composed.wrap(composed.wrap(toArgs, inc), mul);
                
                assert.deepEqual(oneM(1, 2, 3), [3, 5, 7]);
                assert.deepEqual(oneN(1, 2, 3), [3, 5, 7]);
                
                var twoM = composed.wrap(toArgs, mul, inc);
                var twoN = composed.wrap(composed.wrap(toArgs, mul), inc);
                
                assert.deepEqual(twoM(1, 2, 3), [4, 6, 8]);
                assert.deepEqual(twoN(1, 2, 3), [4, 6, 8]);
            }],
            ["Multiple wrapl",
            function(){
                var oneM = composed.wrapl(mul, inc, toArgs);
                var oneN = composed.wrapl(mul, composed.wrapl(inc, toArgs));
                
                assert.deepEqual(oneM(1, 2, 3), [3, 5, 7]);
                assert.deepEqual(oneN(1, 2, 3), [3, 5, 7]);
                
                var twoM = composed.wrapl(inc, mul, toArgs);
                var twoN = composed.wrapl(inc, composed.wrapl(mul, toArgs));
                
                assert.deepEqual(twoM(1, 2, 3), [4, 6, 8]);
                assert.deepEqual(twoN(1, 2, 3), [4, 6, 8]);
            }],
            ["Wrap none",
            function(){
                var wrapped = composed.wrap(toArgs);
                
                assert.deepEqual(wrapped(1, 2, 3), [1, 2, 3]);
            }],
            ["Wrapl none",
            function(){
                var wrapped = composed.wrapl(toArgs);
                
                assert.deepEqual(wrapped(1, 2, 3), [1, 2, 3]);
            }],
        ],
    };
});
