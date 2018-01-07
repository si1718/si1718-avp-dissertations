(function() {
    angular
        .module('DissertationsApp')
        .directive('authorIsSet', authorIsSet);

    authorIsSet.$inject = [];

    function authorIsSet($parse) {
        var directive = {
            require: 'ngModel',
            scope: {authorIsSet: '&'},
            link: linkFunc
        }
        
        return directive;
        
        function linkFunc(scope, element, attr, ctrl){
            
            ctrl.$validators.authorIsSet = function(value) {
                var isSet = false;
                if(value || scope.authorIsSet())
                    isSet = true;
                console.log(isSet);
                return isSet;
            }

            scope.$watch(scope.authorIsSet, function(value){
               ctrl.$validate(); 
            });
        }
        
    }
})();
