(function() {
    angular
        .module('DissertationsApp', [
            'ui.router',
            'ngAnimate',
            'ui.bootstrap',
            'ui-notification',
            'ngMessages'
        ]).run(function($state, $rootScope){
            $rootScope.$state = $state;
        });
        
})();
