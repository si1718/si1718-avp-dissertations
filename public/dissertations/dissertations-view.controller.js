(function() {
    angular
        .module('DissertationsApp')
        .controller('DissertationsViewController', DissertationsViewController);

    DissertationsViewController.$inject = ["$scope", "$http", "$stateParams", "$rootScope", "$location", "$uibModal", "$state", "Notification"];

    function DissertationsViewController($scope, $http, $stateParams, $rootScope, $location, $modal, $state, Notification) {
        var vm = this;

        var idDissertation = $stateParams.idDissertation;
        vm.idDissertation = idDissertation;

        if (idDissertation) {
            // call the api and get the dissertation
            $http
                .get("/api/v1/dissertations/" + idDissertation)
                .then(function(response) {
                    var thisDissertation = response.data;
                    vm.dissertation = thisDissertation;
                }, function(error) {
                    errorsHandling(error);
                });
        }
        else
            errorsHandling({status: "404"});

        var errorsHandling = function(error) {
            if (error.status == "400") {
                Notification.error({ message: 'There was a problem with the dissertation identifier. Please make sure this dissertation exists.', positionY: 'bottom', positionX: 'right' });
            }
            else if (error.status == "422") {
                Notification.error({ message: "There are errors in your form.", positionY: 'bottom', positionX: 'right' });
            }
            else if (error.status == "404") {
                Notification.error({ message: "Dissertation not found.", delay: null, positionY: 'bottom', positionX: 'right' });
            }
            else {
                Notification.error({ message: "An unexpected error has occurred.", delay: null, positionY: 'bottom', positionX: 'right' });
            }
        }
    }
})();
