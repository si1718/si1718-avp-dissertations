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
                .get("/api/v1.1/dissertations/" + idDissertation)
                .then(function(response) {
                    var thisDissertation = response.data;
                    vm.dissertation = thisDissertation;
                    $http
                        .get("/api/v1.1/dissertations/recommendations/" + idDissertation)
                        .then(function(response) {
                            var idDissertations = response.data;
                            vm.recommendations = [];
                            idDissertations.forEach(x => {
                                console.log(x);
                                $http
                                    .get("/api/v1/dissertations/" + x)
                                    .then(function(response) {
                                        vm.recommendations.push(response.data);
                                    });
                            });
                        }, function(error) {
                            Notification.error({ message: "An error has occurred when retrieving recommendations.", delay: null, positionY: 'bottom', positionX: 'right' });
                        });

                    if (thisDissertation.keywords.length && !thisDissertation.summary) {
                        var keywordsToSearch = thisDissertation.keywords.filter(x => x.split(" ").length <= 2);
                        $http
                            .get("https://si1718-dissertations-browser.herokuapp.com/api/v1/dissertations?search=" + keywordsToSearch.join(' '))
                            .then(function(response) {
                                console.log(response.data);
                                var results = response.data;
                                if (results.length) {
                                    var candidates = results
                                        .map(x => { return { dissertation: x, similarity: similarity(normalize(x.title), normalize(thisDissertation.title)) } })
                                        .sort(function(a, b) { return (a.similarity > b.similarity) ? -1 : ((b.similarity > a.similarity) ? 1 : 0); });
                                    console.log(candidates);
                                    var candidate = candidates.shift();
                                    // is a candidate only if similarity is greater than 0.5
                                    if (candidate.similarity > 0.5) {
                                        vm.candidate = candidate.dissertation;

                                        vm.addSummary = function() {
                                            $http
                                                .put("/api/v1.1/dissertations/" + idDissertation, { summary: vm.candidate.summary })
                                                .then(function(response) {
                                                    Notification.success({ message: "Summary successfully added.", positionY: 'bottom', positionX: 'right' });
                                                    $state.transitionTo($state.current, $stateParams, {
                                                        reload: true,
                                                        inherit: false,
                                                        notify: true
                                                    });
                                                }, function(error) {
                                                    Notification.error({ message: "An unexpected error has occurred when adding the summary.", positionY: 'bottom', positionX: 'right' });
                                                });
                                        }
                                    }

                                    // Suggest to add the non similar dissertations
                                    var suggestions = getRandomSubarray(candidates.map(x => x.dissertation), 5);
                                    suggestions = suggestions.map(x => { return { title: x.title, tutors: x.tutors, author: x.authors[0], summary: x.summary, year: Number(x.date.split(" ")[x.date.split(" ").length - 1]) } })
                                    console.log(suggestions);
                                    vm.suggestions = suggestions;
                                    vm.toCreateDissertationState = function(dissertation) {
                                        $state.go('dissertations-edit.create', { newSisiusDissertation: dissertation });
                                    }
                                }

                            });
                    }
                }, function(error) {
                    errorsHandling(error);
                });
        }
        else
            errorsHandling({ status: "404" });

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
