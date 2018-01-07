(function() {
    angular
        .module('DissertationsApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('callback', {
            parent: 'app',
            url: '/callback',
            views: {
                'content@': {
                    templateUrl: 'callback/callback.html',
                    controller: 'CallbackController',
                    controllerAs: 'vm'
                }
            }
        });
    }

})();
