(function() {

    angular
        .module('DissertationsApp')
        .controller('DissertationsController', DissertationsController);

    DissertationsController.$inject = ["$scope", "$http", "$uibModal", "$timeout", "$rootScope", "Notification", "$stateParams"];

    function DissertationsController($scope, $http, $uibModal, $timeout, $rootScope, Notification, $stateParams) {
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
                            Notification.error({ message: 'An unexpected error has ocurred.', delay: null });
                            vm.hideTable = true;
                        });
                }, function(error) {
                    Notification.error({ message: 'An unexpected error has ocurred.', delay: null });
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

        loadDissertations(1, 5, search);
    }

})();
