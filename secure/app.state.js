(function() {
    angular
        .module('DissertationsApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

    function stateConfig($stateProvider, $urlRouterProvider) {
        $stateProvider.state('app', {
            views: {
                'navbar': {
                    templateUrl: 'layouts/navbar/navbar.html',
                    controller: 'NavbarController',
                    controllerAs: 'vm'
                }
            }
        });
        
        $urlRouterProvider.otherwise('/');
    }
})();
