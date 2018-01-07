(function() {

    angular
        .module('DissertationsApp')
        .controller('CallbackController', CallbackController);

    CallbackController.$inject = ["$scope", "$http", "$uibModal", "$timeout", "$rootScope", "Notification", "$stateParams", "authService"];

    function CallbackController($scope, $http, $uibModal, $timeout, $rootScope, Notification, $stateParams, authService) {
        var vm = this;
        console.log("HOLAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
        console.log($stateParams);
    }

})();
