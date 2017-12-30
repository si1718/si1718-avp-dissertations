(function() {

    angular
        .module('DissertationsApp')
        .controller('DissertationsController', DissertationsController);

    DissertationsController.$inject = ["$scope", "$http", "$uibModal", "$timeout", "$rootScope"];

    function DissertationsController($scope, $http, $uibModal, $timeout, $rootScope) {
        var vm = this;

        var search = "";

        var loadDissertations = function(page, limit, search) {
            $http
                .get("/api/v1/dissertations?offset=" + ((page - 1) * limit) + "&limit=" + limit + search)
                .then(function(response) {
                    // get count of elements in db for this query
                    $http
                        .get('/api/v1/dissertations/stats' + search.replace("&", "?"))
                        .then(function(stats) {
                            vm.dissertations = response.data;
                            vm.pagination = { total: stats.data.total, page: page, limit: limit }
                            vm.hideTable = false;
                        }, function(error) {
                            vm.errorMessage = "An unexpected error has ocurred.";
                            vm.hideTable = true;
                        });
                }, function(error) {
                    vm.errorMessage = "An unexpected error has ocurred.";
                    vm.hideTable = true;
                });
        };

        var loadPage = function() {
            loadDissertations(vm.pagination.page, 5, search);
        };

        vm.loadPage = loadPage;

        vm.search = function() {
            if (vm.query) {
                search = "&search=" + vm.query;
                loadPage();
            }

        };
        
        
        vm.deleteDissertation = function(idDissertation) {
            $http.delete("/api/v1/dissertations/" + idDissertation)
                .then(function(response) {
                    loadPage();
                    vm.successMessage = "The dissertation with id " + idDissertation + " was deleted successfully.";
                }, function(error) {
                    vm.errorMessage = "There was an error while deleting the dissertation with id " + idDissertation;
                });
        }

        var closeSuccess = function() {
            delete $rootScope.successMessage;
            delete vm.successMessage;
        }

        var closeError = function() {
            delete vm.errorMessage;
        }

        vm.closeSuccess = closeSuccess;

        loadDissertations(1, 5, search);

    }

})();
