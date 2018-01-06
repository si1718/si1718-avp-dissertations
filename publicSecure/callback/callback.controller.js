(function() {

    angular
        .module('DissertationsApp')
        .controller('CallbackController', CallbackController);

    CallbackController.$inject = ["$scope", "$http", "$uibModal", "$timeout", "$rootScope", "Notification", "$stateParams"];

    function CallbackController($scope, $http, $uibModal, $timeout, $rootScope, Notification, $stateParams) {
        var vm = this;
    }

})();
