(function(){
    angular
        .module('DissertationsApp')
        .config(stateConfig);
        
        stateConfig.$inject = ['$stateProvider'];
        
        function stateConfig($stateProvider) {
            $stateProvider
                .state('dissertations', {
                    parent: 'app',
                    url: '/dissertations',
                    views: {
                        'content@': {
                            templateUrl: 'dissertations/dissertations.html',
                            controller: 'DissertationsController',
                            controllerAs: 'vm'
                        }
                    }
                });
        }
})();