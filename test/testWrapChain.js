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
                function a(v){ return [v + this.x];};
                function b(v){ return [v * this.y];};
                
                var f = composed.wrapChain({x:1, y:2}, a, b, a);
                assert.equal(f(0), 3);
                
                var g = composed.wrapChain({x:1, y:2}, b, b, a);
                assert.equal(g(0), 4);
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
