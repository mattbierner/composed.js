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
        'module': "Compose Tests",
        'tests': [
            ["Simple compose",
            function(){
                var composeped = composed.compose(mul, inc);
                
                assert.deepEqual(composeped(1), 4);
            }],
            ["Simple composel",
            function(){
                var composeped = composed.composel(inc, mul);
                
                assert.deepEqual(composeped(1), 4);
            }],
            ["Multiple Argument compose",
            function(){
                var one = composed.compose(inc, product);
                var two = composed.compose(mul, sum);
                
                assert.deepEqual(one(1, 2, 3), 7);
                assert.deepEqual(two(1, 2, 3), 12);
            }],
            ["Multiple Argument composel",
            function(){
                var one = composed.composel(product, inc);
                var two = composed.composel(sum, mul);
                
                assert.deepEqual(one(1, 2, 3), 7);
                assert.deepEqual(two(1, 2, 3), 12);
            }],
            ["Multiple compose",
            function(){
                var oneM = composed.compose(inc, mul, sum);
                var oneN = composed.compose(composed.compose(inc, mul), sum);
                
                assert.deepEqual(oneM(1, 2, 3), 13);
                assert.deepEqual(oneN(1, 2, 3), 13);
                
                var twoM = composed.compose(mul, inc, sum);
                var twoN = composed.compose(composed.compose(mul, inc), sum);
                
                assert.deepEqual(twoM(1, 2, 3), 14);
                assert.deepEqual(twoN(1, 2, 3), 14);
                
                var threeM = composed.compose(inc, sum, sum);
                var threeN = composed.compose(composed.compose(inc, sum), sum);
                
                assert.deepEqual(threeM(1, 2, 3), 7);
                assert.deepEqual(threeN(1, 2, 3), 7);
            }],
            ["Multiple composel",
            function(){
                var oneM = composed.composel(sum, mul, inc);
                var oneN = composed.composel(sum, composed.composel(mul, inc));
                
                assert.deepEqual(oneM(1, 2, 3), 13);
                assert.deepEqual(oneN(1, 2, 3), 13);
                
                var twoM = composed.composel(sum, inc, mul);
                var twoN = composed.composel(sum, composed.composel(inc, mul));
                
                assert.deepEqual(twoM(1, 2, 3), 14);
                assert.deepEqual(twoN(1, 2, 3), 14);
                
                var threeM = composed.composel(sum, sum, inc);
                var threeN = composed.composel(sum, composed.composel(sum, inc));
                
                assert.deepEqual(threeM(1, 2, 3), 7);
                assert.deepEqual(threeN(1, 2, 3), 7);
            }],
            ["compose none",
            function(){
                var composeped = composed.compose(sum);
                
                assert.deepEqual(composeped(1, 2, 3), 6);
            }],
            ["composel none",
            function(){
                var composeped = composed.composel(sum);
                
                assert.deepEqual(composeped(1, 2, 3), 6);
            }],
        ],
    };
});
