(function() {
    angular
        .module('DissertationsApp')
        .controller('DissertationsDeleteController', DissertationsDeleteController);

    DissertationsDeleteController.$inject = ['$http', '$uibModalInstance', "$stateParams", "idDissertation", "Notification"];

    function DissertationsDeleteController($http, $uibModalInstance, $stateParams, idDissertation, Notification) {
        var vm = this;
        //var idDissertation = $stateParams.idDissertation;

        console.log(idDissertation);

        $http.get("api/v1/dissertations/" + idDissertation)
            .then(function(response) {
                vm.dissertation = response.data;
            }, function(error) {
                Notification.error({ message: "An unexpected error has occurred while getting this dissertation.", positionY: 'bottom', positionX: 'right' });
                $uibModalInstance.dismiss('cancel');
            });

        vm.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        }

        vm.deleteDissertation = function() {
            $http.delete("/api/v1/dissertations/" + idDissertation)
                .then(function(response) {
                    Notification.success({ message: "The dissertation with id " + idDissertation + " was successfully deleted.", positionY: 'bottom', positionX: 'right' });
                    $uibModalInstance.close();
                }, function(error) {
                    Notification.error({ message: "An unexpected error has occurred while deleting this dissertation.", positionY: 'bottom', positionX: 'right' });
                    $uibModalInstance.dismiss('cancel');
                });
        }

    }

})();
