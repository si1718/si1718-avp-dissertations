(function() {
    angular
        .module('DissertationsApp')
        .controller('DissertationsDeleteController', DissertationsDeleteController);

    DissertationsDeleteController.$inject = ['$http', '$uibModalInstance', "$stateParams", "idDissertation", "Notification", "$state"];

    function DissertationsDeleteController($http, $uibModalInstance, $stateParams, idDissertation, Notification, $state) {
        var vm = this;
        //var idDissertation = $stateParams.idDissertation;

        console.log(idDissertation);

        $http.get("/api/v1.1/dissertations/" + idDissertation)
            .then(function(response) {
                vm.dissertation = response.data;
            }, function(error) {
                if (error.status == 401) {
                    Notification.error({ message: 'Error: You are not authorized for this action.', positionY: 'bottom', positionX: 'right', delay: "10000" });
                }
                else {
                    Notification.error({ message: "An unexpected error has occurred while getting this dissertation.", positionY: 'bottom', positionX: 'right' });
                }
                $uibModalInstance.dismiss('cancel');
            });

        vm.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        }

        vm.deleteDissertation = function() {
            $http.delete("/api/v1.1/dissertations/" + idDissertation)
                .then(function(response) {
                    Notification.success({ message: "The dissertation with id " + idDissertation + " was successfully deleted.", positionY: 'bottom', positionX: 'right' });
                    $uibModalInstance.close();
                }, function(error) {
                    if (error.status == 401) {
                        Notification.error({ message: 'Error: You are not authorized for this action.', positionY: 'bottom', positionX: 'right', delay: "10000" });
                    }
                    else {
                        Notification.error({ message: "An unexpected error has occurred while deleting this dissertation.", positionY: 'bottom', positionX: 'right' });
                    }
                    $uibModalInstance.dismiss('cancel');
                });
        }

    }

})();
