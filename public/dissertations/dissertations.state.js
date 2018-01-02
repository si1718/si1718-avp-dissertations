(function() {
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
            }).state('dissertations.delete', {
                url: '/{idDissertation}/delete',
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                       templateUrl: 'dissertations/dissertations-delete.html',
                       controller: 'DissertationsDeleteController',
                       controllerAs: 'vm',
                       resolve: {
                           idDissertation: function(){return $stateParams.idDissertation}
                       }
                    }).result.then(function(){
                        $state.go('dissertations', null, {reload: 'dissertations'});
                    }, function(){
                        $state.go('^');
                    });
                }]
            }).state('dissertations-edit', {
                abstract: true,
                parent: 'app'
            }).state('dissertations-edit.create', {
                url: '/dissertations/create',
                views: {
                    'content@': {
                        templateUrl: 'dissertations/dissertations-edit.html',
                        controller: 'DissertationsEditController',
                        controllerAs: 'vm'
                    }
                }
            }).state('dissertations-edit.edit', {
                url: '/dissertations/{idDissertation}/edit',
                views: {
                    'content@': {
                        templateUrl: 'dissertations/dissertations-edit.html',
                        controller: 'DissertationsEditController',
                        controllerAs: 'vm'
                    }
                }
            }).state('dissertations-view', {
                url: '/dissertations/{idDissertation}/view',
                parent: 'app',
                views: {
                    'content@': {
                        templateUrl: 'dissertations/dissertations-view.html',
                        controller: 'DissertationsViewController',
                        controllerAs: 'vm'
                    }
                }
            });
    }
})();
