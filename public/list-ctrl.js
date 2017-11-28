angular.module("DissertationsApp")
    .controller("ListCtrl", ["$scope", "$http", "$uibModal", "$timeout", "$rootScope", function($scope, $http, $uibModal, $timeout, $rootScope) {
        var search = "";

        var loadDissertations = function(page, limit, search) {
            $http
                .get("/api/v1/dissertations?offset=" + ((page - 1) * limit) + "&limit=" + limit + search)
                .then(function(response) {
                    $scope.dissertations = response.data.docs;
                    $scope.pagination = { total: response.data.total, page: parseInt(((response.data.offset) / response.data.limit) + 1, 10), pages: response.data.pages, limit: response.data.limit }
                    $scope.hideTable = false;
                }, function(error) {
                    console.log(error);
                    $scope.errorMessage = "An unexpected error has ocurred.";
                    $scope.hideTable = true;
                });
        };

        var loadPage = function() {
            loadDissertations($scope.pagination.page, 5, search);
        };

        $scope.loadPage = loadPage;

        $scope.search = function() {
            if ($scope.query) {
                search = "&search=" + $scope.query;
                loadPage();
            }

        };

        $scope.deleteDissertation = function(idDissertation) {
            $http.delete("/api/v1/dissertations/" + idDissertation)
                .then(function(response) {
                    loadPage();
                    $scope.successMessage = "The dissertation with id " + idDissertation + " was deleted successfully.";
                }, function(error) {
                    $scope.errorMessage = "There was an error while deleting the dissertation with id " + idDissertation;
                });
        }

        var closeSuccess = function() {
            delete $rootScope.successMessage;
            delete $scope.successMessage;
        }

        var closeError = function() {
            delete $scope.errorMessage;
        }

        $scope.closeSuccess = closeSuccess;

        loadDissertations(1, 5, search);

    }]);
