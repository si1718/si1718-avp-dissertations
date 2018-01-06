(function() {
    angular
        .module('DissertationsApp', [
            'ui.router',
            'ngAnimate',
            'ui.bootstrap',
            'ui-notification',
            'ngMessages',
            'auth0.auth0'
        ]).run(function($state, $rootScope) {
            $rootScope.$state = $state;
        }).config(function(angularAuth0Provider) {
            angularAuth0Provider.init({
                clientID: 'Ox85DK2tYEz45ZZl4LY1xAp3x2IFUaIO',
                domain: 'si1718-avp-dissertations.eu.auth0.com',
                responseType: 'token id_token',
                audience: 'https://si1718-avp-dissertations.eu.auth0.com/userinfo',
                redirectUri: 'https://si1718-avp-dissertations-alvarovp27.c9users.io/secure/#!/callback',
                scope: 'openid'
            });
        });

})();
