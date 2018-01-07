(function() {
    angular
        .module('DissertationsApp', [
            'ui.router',
            'ngAnimate',
            'ui.bootstrap',
            'ui-notification',
            'ngMessages',
            'auth0.auth0',
            'angular-jwt'
        ])
        .config(config)
        .run(run);

    config.$inject = ['angularAuth0Provider', 'jwtOptionsProvider', '$httpProvider'];
    run.$inject = ['$state', '$rootScope', 'authService'];

    function config(angularAuth0Provider, jwtOptionsProvider, $httpProvider) {
        angularAuth0Provider.init({
            clientID: 'Ox85DK2tYEz45ZZl4LY1xAp3x2IFUaIO',
            domain: 'si1718-avp-dissertations.eu.auth0.com',
            responseType: 'token id_token',
            audience: 'https://si1718-avp-dissertations-alvarovp27.c9users.io/',
            redirectUri: 'https://si1718-avp-dissertations-alvarovp27.c9users.io/secure/#',
            scope: 'openid profile'
        });

        jwtOptionsProvider.config({
            tokenGetter: function() {
                return localStorage.getItem('access_token');
            }
        });
        $httpProvider.interceptors.push('jwtInterceptor');
    }

    function run($state, $rootScope, authService) {
        $rootScope.$state = $state;
        authService.handleParseHash();
    }

})();
