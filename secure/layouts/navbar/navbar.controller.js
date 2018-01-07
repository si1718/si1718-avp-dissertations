(function(){
    angular
        .module('DissertationsApp')
        .controller('NavbarController', NavbarController);
        
        NavbarController.$inject = ['authService', '$state'];
        
        function NavbarController(authService, $state) {
            var vm = this;
            vm.auth = authService;
            
            vm.logout = function() {
                authService.logout();
                $state.go('home');
            }
        }
        
})();