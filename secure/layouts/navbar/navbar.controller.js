(function(){
    angular
        .module('DissertationsApp')
        .controller('NavbarController', NavbarController);
        
        NavbarController.$inject = ['authService'];
        
        function NavbarController(authService) {
            var vm = this;
            vm.auth = authService;
        }
        
})();