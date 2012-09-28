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
            
            ["Multiple wrap",
            function(){
                var one = composed.wrap(toArgs, inc, mul);
                var two = composed.wrap(toArgs, mul, inc);

                assert.deepEqual(one(1, 2, 3), [3, 5, 7]);
                assert.deepEqual(two(1, 2, 3), [4, 6, 8]);
            }],
            
            ["Multiple wrap",
            function(){
                var oneM = composed.wrap(toArgs, inc, mul);
                var oneN = composed.wrap(composed.wrap(toArgs, inc), mul);

                var twoM = composed.wrap(toArgs, mul, inc);
                var twoN = composed.wrap(composed.wrap(toArgs, mul), inc);

                assert.deepEqual(oneM(1, 2, 3), [3, 5, 7]);
                assert.deepEqual(oneN(1, 2, 3), [3, 5, 7]);

                assert.deepEqual(twoM(1, 2, 3), [4, 6, 8]);
                assert.deepEqual(twoN(1, 2, 3), [4, 6, 8]);
            }],
            
            ["Wrap none",
            function(){
                var wrapped = composed.wrap(toArgs);

                assert.deepEqual(wrapped(1, 2, 3), [1, 2, 3]);
            }],

        ],
    };
});
