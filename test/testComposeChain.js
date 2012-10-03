define(['composed'], function(composed){
    
    return {
        'module': "Compose Chain Tests",
        'tests': [
            ["Simple compose chain",
            function(){
                var state = {};
                var f = composed.composeChain(state, function(v){
                    this.a = v; return v;
                });
                
                assert.deepEqual(f(1), 1);
                assert.equal(state.a, 1);
            }],
            ["Multiple compose chain",
            function(){
                var state = [];
                function a(v){ this[v] = v; return v + 1;};
                var g = composed.composeChain(state, a, a, a);
                
                assert.deepEqual(g(0), 3);
                assert.deepEqual(state, [0, 1, 2]);
            }],
            ["compose chain  none",
            function(){
                var state = [4, 5, 6];
                var wrapped = composed.composeChain(state);
                assert.deepEqual(wrapped(1, 2, 3), undefined);
                assert.deepEqual(state, [4, 5, 6]);
            }],
        ],
    };
});
