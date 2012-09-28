define(['composed'], function(composed){
    
    return {
        'module': "Wrap Chain Tests",
        'tests': [
            ["Simple wrap chain",
            function(){
                var state = {};
                var f = composed.wrapChain(state, function(v){
                    this.a = v; return [v];
                });
                
                assert.equal(f(1), 1);
                assert.equal(state.a, 1);
            }],
            ["Multiple wrap chain",
            function(){
                var state = [];
                function a(v){ this[v] = v; return [v + 1];};
                var g = composed.wrapChain(state, a, a, a);
                
                assert.equal(g(0), 3);
                assert.deepEqual(state, [0, 1, 2]);
            }],
            ["Wrap none",
            function(){
                var state = [4, 5, 6];
                var wrapped = composed.wrapChain(state);
                assert.equal(wrapped(1, 2, 3), undefined);
                assert.deepEqual(state, [4, 5, 6]);
            }],
            
            ["Simple Explicit Wrap Chain",
            function(){
                var state = {};
                var f = composed.wrapChainExplicit(state, function(s, v){
                    s.a = v; return [v];
                });
                
                assert.equal(f(1), 1);
                assert.equal(state.a, 1);
            }],
        ],
    };
});
