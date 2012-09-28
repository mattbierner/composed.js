define(['composed'], function(composed){
        
    function inc(e) {
        return e + 1;
    }
    
    function mul(e){
        return e * 2;
    }
    
    function sum() {
        return Array.prototype.reduce.call(arguments, function(p, c) {
            return p + c;
        });
    }
    
    
    function product() {
        return Array.prototype.reduce.call(arguments, function(p, c) {
            return p * c;
        });
    }
    
    return {
        'module': "ComposeIterate Tests",
        'tests': [
            ["Simple ComposeIterate",
            function(){
                var f = composed.composeIterate(inc, 4);
                assert.deepEqual(f(1), 5);
                
                var g = composed.composeIterate(inc, 100);
                assert.deepEqual(g(1), 101);
            }],
            
            ["Multiple Argument ComposeIterate",
            function(){
                var one = composed.composeIterate(sum, 4);
                var two = composed.composeIterate(product, 10);
                
                assert.equal(one(1, 2, 3), 6);
                assert.equal(two(1, 2, 3), 6);
            }],
            
            ["Nested ComposeIterate",
            function(){
                var oneM = composed.composeIterate(composed.composeIterate(inc, 2), 3);
                
                assert.equal(oneM(1), 7);
            }],
            ["ComposeIterate One",
            function(){
                var composeped = composed.composeIterate(inc, 1);
                
                assert.equal(composeped(1), 2);
            }],
            ["ComposeIterate Zero",
            function(){
                var composeped = composed.composeIterate(inc, 0);
                
                assert.equal(composeped(1), undefined);
            }],
        ],
    };
});
