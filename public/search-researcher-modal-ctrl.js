angular.module("DissertationsApp")
    .controller("SearchResearcherModalCtrl", ["$scope", "$http", "researchers", "$uibModalInstance", function($scope, $http, query, $uibModalInstance) {
        $http
            .get("https://si1718-dfr-researchers.herokuapp.com/api/v1/researchers?search=" + query)
            .then(function(response) {
                if (response.data.length > 0) {
                    $scope.researchers = response.data;
                    $scope.showTable = true;
                }
                else {
                    $scope.showTable = false;
                    $scope.errorMessage = "No researchers have been found."
                }
            }, function(error) {
                $scope.showTable = false;
                $scope.errorMessage = "An unexpected error has occurred. Please try later."
            });

        $scope.cancel = function() {
            $uibModalInstance.close();
        }

        $scope.ok = function(researcher) {
            $uibModalInstance.close(researcher);
        };
    }]);
