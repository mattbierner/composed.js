define(['composed'], function(composed){
        
    function inc(e) {
        return [e + 1];
    }
    
    function mul(e){
        return [e * 2];
    }
    
    function sum() {
        return [Array.prototype.reduce.call(arguments, function(p, c) {
            return p + c;
        })];
    }
    
    
    function product() {
        return [Array.prototype.reduce.call(arguments, function(p, c) {
            return p * c;
        })];
    }
    
    return {
        'module': "wrapIterate Tests",
        'tests': [
            ["Simple WrapIterate",
            function(){
                var f = composed.wrapIterate(inc, 4);
                assert.deepEqual(f(1), [5]);
                
                var g = composed.wrapIterate(inc, 100);
                assert.deepEqual(g(1), [101]);
            }],
            ["Multiple Argument WrapIterate",
            function(){
                var one = composed.wrapIterate(sum, 4);
                var two = composed.wrapIterate(product, 10);
                
                assert.equal(one(1, 2, 3), 6);
                assert.equal(two(1, 2, 3), 6);
            }],
            ["Nested WrapIterate",
            function(){
                var oneM = composed.wrapIterate(composed.wrapIterate(inc, 2), 3);
                
                assert.equal(oneM(1), 7);
            }],
            ["WrapIterate One",
            function(){
                var composeped = composed.wrapIterate(inc, 1);
                
                assert.equal(composeped(1), 2);
            }],
            ["WrapIterate Zero",
            function(){
                var composeped = composed.wrapIterate(inc, 0);
                
                assert.equal(composeped(1), undefined);
            }],
        ],
    };
});
