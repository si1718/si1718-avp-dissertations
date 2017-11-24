angular.module("DissertationsApp")
    .controller("ListCtrl", ["$scope", "$http", function($scope, $http) {
        var loadDissertations = function(page, limit, search) {
            $http
                .get("/api/v1/dissertations?offset=" + ((page - 1) * limit) + "&limit=" + limit + search)
                .then(function(response) {
                    $scope.dissertations = response.data.docs;
                    $scope.pagination = { total: response.data.total, page: parseInt(((response.data.offset) / response.data.limit) + 1, 10), pages: response.data.pages, limit: response.data.limit }
                });
        };

        var search = "";
        loadDissertations(1, 5, search);

        $scope.loadPage = function() {
            loadDissertations($scope.pagination.page, 5, search);
        };

        $scope.search = function() {
            if ($scope.query) {
                search = "&search=" + $scope.query;
                $scope.loadPage();
            }

        };


    }]);
