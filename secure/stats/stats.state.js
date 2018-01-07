(function() {
    angular
        .module('DissertationsApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('stats', {
            parent: 'app',
            url: '/stats',
            views: {
                'content@': {
                    templateUrl: 'stats/stats.html',
                    controller: 'StatsController',
                    controllerAs: 'vm'
                }
            }
        });
    }

})();
