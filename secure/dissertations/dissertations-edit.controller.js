(function() {
    angular
        .module('DissertationsApp')
        .controller('DissertationsEditController', DissertationsEditController);

    DissertationsEditController.$inject = ["$scope", "$http", "$stateParams", "$rootScope", "$location", "$uibModal", "$state", "Notification"];

    function DissertationsEditController($scope, $http, $stateParams, $rootScope, $location, $modal, $state, Notification) {
        var vm = this;

        var idDissertation = $stateParams.idDissertation;
        var newSisiusDissertation = $stateParams.newSisiusDissertation;

        vm.idDissertation = idDissertation;

        if (idDissertation) {
            // call the api and get the dissertation
            $http
                .get("/api/v1.1/dissertations/" + idDissertation)
                .then(function(response) {
                    var thisDissertation = response.data;
                    if (!thisDissertation.keywords)
                        thisDissertation.keywords = [];
                    vm.dissertation = thisDissertation;
                }, function(error) {
                    errorsHandling(error);
                    vm.hideForm = true;
                });
        }
        else {
            if (newSisiusDissertation) {
                delete newSisiusDissertation._id;
                if (newSisiusDissertation.author === 'undefined')
                    delete newSisiusDissertation.author;
                vm.dissertation = newSisiusDissertation
            }
            else {
                // create empty dissertation
                vm.dissertation = {
                    tutors: [],
                    author: "",
                    title: "",
                    year: 2018,
                    keywords: []
                }
            }
        }

        vm.deleteTutor = function(index) {
            vm.dissertation.tutors.splice(index, 1);
        }

        vm.addTutor = function() {
            vm.dissertation.tutors.push(vm.tutorName);
            delete vm.tutorName;
        }


        vm.validateTutor = function(index) {
            validateResearcher(index, 'tutor');
        }

        vm.validateAuthor = function(str) {
            validateResearcher(str, 'author');
        }

        vm.editAuthor = function() {
            vm.dissertation.author = "";
            delete vm.dissertation.authorName;
            delete vm.dissertation.authorViewURL;
        }

        var validateResearcher = function(str, type) {
            if (type === 'tutor')
                var researcherObj = vm.dissertation.tutors[str];
            else
                var researcherObj = str;
            if (isUrl(researcherObj.url)) {
                vm.errorMessage = "This researcher has already been validated.";
            }
            else if (isIdResearcher(researcherObj)) {
                console.log("AAAA");
                $http
                    .get("https://si1718-dfr-researchers.herokuapp.com/api/v1/researchers/" + researcherObj)
                    .then(function(response) {
                        if (type === 'tutor') {
                            vm.dissertation.tutors[str] = {
                                url: "https://si1718-dfr-researchers.herokuapp.com/api/v1/researchers/" + response.data.idResearcher,
                                name: response.data.name,
                                view: response.data.viewURL
                            }
                        }
                        else {
                            vm.dissertation.author = "https://si1718-dfr-researchers.herokuapp.com/api/v1/researchers/" + response.data.idResearcher;
                            vm.dissertation.authorName = response.data.name;
                            vm.dissertation.authorViewURL = response.data.viewURL;
                        }

                    }, function(error) {
                        if (error.status == '404')
                            vm.errorMessage = "The researcher couldn't be found with the specified identifier. You may try again by specifying the researcher's name.";
                        else
                            vm.errorMessage = "Couldn't validate this researcher. Please try later.";
                    });
            }
            else {
                console.log(researcherObj + " dfdfdfd");
                // open modal and print paginated results
                var modalInstance = $modal.open({
                    templateUrl: 'seachResearcherModal.html',
                    controller: 'SearchResearcherModalCtrl',
                    resolve: {
                        researchers: function() {
                            return researcherObj;
                        }
                    }
                });

                modalInstance.result.then(function(selectedItem) {
                    if (type === 'tutor') {
                        vm.dissertation.tutors[str] = {
                            url: "https://si1718-dfr-researchers.herokuapp.com/api/v1/researchers/" + selectedItem.idResearcher,
                            name: selectedItem.name,
                            view: selectedItem.viewURL
                        }
                    }
                    else {
                        vm.dissertation.author = "https://si1718-dfr-researchers.herokuapp.com/api/v1/researchers/" + selectedItem.idResearcher;
                        vm.dissertation.authorName = selectedItem.name;
                        vm.dissertation.authorViewURL = selectedItem.viewURL;
                    }
                }, function() {
                    console.log('Modal dismissed at: ' + new Date());
                });
            }
        }

        // click function for saving (call put or post depending on if there's idDissertation or not)
        vm.send = function(dissertation) {
            if (typeof dissertation.keywords === 'string')
                dissertation.keywords = dissertation.keywords.split(",");
            if (idDissertation) {
                delete dissertation._id;
                $http
                    .put("/api/v1.1/dissertations/" + idDissertation, dissertation)
                    .then(function(response) {
                        console.log(response);
                        $state.go("dissertations");
                        Notification.success({ message: "The dissertation has been successfully updated.", positionY: 'bottom', positionX: 'right' });
                    }, function(error) {
                        errorsHandling(error);
                    });
            }
            else {
                var idNewSisiusDissertation = false;
                if (newSisiusDissertation)
                    idNewSisiusDissertation = newSisiusDissertation.idDissertation;
                vm.dissertation.idDissertation;
                $http
                    .post("/api/v1.1/dissertations", vm.dissertation)
                    .then(function(response) {
                        console.log(response);
                        // if it was a newSisiusDissertation, then delete it from database
                        if (idNewSisiusDissertation) {
                            $http
                                .delete("/api/v1.1/newSisiusDissertations/" + idNewSisiusDissertation)
                                .then(function(response) { console.log("New sisius dissertation with id " + idNewSisiusDissertation + " successfully deleted.") });

                            $state.go("newSisiusDissertations");
                        }
                        else {
                            $state.go("dissertations");
                        }

                        Notification.success({ message: "The dissertation has been successfully created.", positionY: 'bottom', positionX: 'right' });
                    }, function(error) {
                        errorsHandling(error);
                    });
            }
        }

        // list of tutors validation
        $scope.$watch(function() {
            return vm.dissertation.tutors;
        }, function(current) {
            console.log(current);
            var isValid = false;
            if (current.length > 0) {
                isValid = true;
            }
            $scope.dissertationForm.$setValidity('tutorsEmpty', isValid);
        }, true);

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
            else if (error.status == "409") {
                Notification.error({ message: "This dissertation already exists. Try changing the author and the year.", delay: null, positionY: 'bottom', positionX: 'right' });
            }
            else if (error.status == 401) {
                Notification.error({ message: 'Error: You are not authorized for this action.', positionY: 'bottom', positionX: 'right', delay: "10000" });
                $state.go("home")
            }
            else {
                Notification.error({ message: "An unexpected error has occurred.", delay: null, positionY: 'bottom', positionX: 'right' });
            }
        }
    }
})();
