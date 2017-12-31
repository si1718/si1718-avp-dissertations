(function() {
    angular
        .module('DissertationsApp')
        .controller('DissertationsDeleteController', DissertationsDeleteController);

    DissertationsDeleteController.$inject = ['$http', '$uibModalInstance', "$stateParams", "idDissertation"];

    function DissertationsDeleteController($http, $uibModalInstance, $stateParams, idDissertation) {
        var vm = this;
        //var idDissertation = $stateParams.idDissertation;

        console.log(idDissertation);

        $http.get("api/v1/dissertations/" + idDissertation)
            .then(function(response) {
                vm.dissertation = response.data;
            }, function(error) {
                //todo: controlar este error 
            });

        vm.cancel = function() {
            //$uibModalInstance.close();
            $uibModalInstance.dismiss('cancel');

        }

        vm.deleteDissertation = function() {
            $http.delete("/api/v1/dissertations/" + idDissertation)
                .then(function(response) {
                    //loadPage();
                    $uibModalInstance.close();
                    vm.successMessage = "The dissertation with id " + idDissertation + " was successfully deleted.";
                }, function(error) {
                    vm.errorMessage = "There was an error while deleting the dissertation with id " + idDissertation;
                });
        }

    }

})();
