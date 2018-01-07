(function() {

    angular
        .module('DissertationsApp')
        .controller('NewSisiusDissertationsController', NewSisiusDissertationsController);

    NewSisiusDissertationsController.$inject = ["$scope", "$http", "$uibModal", "$timeout", "$rootScope", "Notification", "$stateParams", "$state"];

    function NewSisiusDissertationsController($scope, $http, $uibModal, $timeout, $rootScope, Notification, $stateParams, $state) {
        var vm = this;

        var loadDissertations = function(page, limit) {
            $http
                .get("/api/v1.1/newSisiusDissertations?offset=" + ((page - 1) * limit) + "&limit=" + limit)
                .then(function(response) {
                    // get count of elements in db for this query
                    $http
                        .get('/api/v1.1/newSisiusDissertations/stats')
                        .then(function(stats) {
                            vm.dissertations = response.data;
                            vm.pagination = { total: stats.data.total, page: page, limit: limit }
                            vm.hideTable = false;
                        }, function(error) {
                            Notification.error({ message: 'An unexpected error has ocurred.', delay: null });
                            vm.hideTable = true;
                        });
                }, function(error) {
                    if (error.status == 401) {
                        Notification.error({ message: 'Error: You are not authorized for this action.', positionY: 'bottom', positionX: 'right', delay: "10000" });
                        $state.go("home")
                    }
                    else {
                        Notification.error({ message: 'An unexpected error has ocurred.', delay: null });
                        vm.hideTable = true;
                    }
                });
        };

        var loadPage = function() {
            loadDissertations(vm.pagination.page, 5);
        };

        vm.toCreateDissertationState = function(dissertation) {
            console.log("FDFDFD");
            $state.go('dissertations-edit.create', { newSisiusDissertation: dissertation });
        }

        vm.loadPage = loadPage;

        loadDissertations(1, 5);
    }

})();
