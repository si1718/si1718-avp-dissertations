(function() {

    angular
        .module('DissertationsApp')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ["$scope", "Notification", "$stateParams", "authService", "$state"];

    function ProfileController($scope, Notification, $stateParams, authService, $state) {
        var vm = this;
        vm.profile;

        if (authService.isAuthenticated()) {
            // it's mandatory to use $apply since the function called by getProfile
            // is outside of angular
            authService.getProfile(function(err, profile) {
                $scope.$apply(function() {
                    vm.profile = profile;
                })
            });
        }
        else {
            Notification.error({ message: 'Error: You are not authorized for this action.', positionY: 'bottom', positionX: 'right', delay: "10000" });
            $state.go('home');
        }

    }

})();
