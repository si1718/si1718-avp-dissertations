(function() {
    angular
        .module('DissertationsApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('profile', {
            parent: 'app',
            url: '/profile',
            views: {
                'content@': {
                    templateUrl: 'profile/profile.html',
                    controller: 'ProfileController',
                    controllerAs: 'vm'
                }
            }
        });
    }

})();
