angular.module("DissertationsApp")
  .controller("EditCtrl", ["$scope", "$http", "$routeParams", "$rootScope", "$location", function($scope, $http, $routeParams, $rootScope, $location) {
    var idDissertation = $routeParams.idDissertation;

    if (idDissertation) {
      // call the api and get the dissertation
      $http
        .get("/api/v1/dissertations/" + idDissertation)
        .then(function(response) {
          $scope.dissertation = response.data;
        }, function(error) {
          errorsHandling(error);
          $scope.hideForm = true;
        });
    }
    else {
      // create empty dissertation
      $scope.dissertation = {
        tutors: [],
        author: "",
        title: "",
        year: 2017
      }
    }

    $scope.deleteTutor = function(index) {
      $scope.dissertation.tutors.splice(index, 1);
    }

    $scope.addTutor = function() {
      $scope.dissertation.tutors.push($scope.tutorName);
      delete $scope.tutorName;
    }

    // click function for saving (call put or post depending on if there's idDissertation or not)
    $scope.send = function(dissertation) {
      if (idDissertation) {
        delete dissertation._id;
        $http
          .put("/api/v1/dissertations/" + idDissertation, dissertation)
          .then(function(response) {
            console.log(response);
            $rootScope.successMessage = "The dissertation has been updated successfully.";
            $location.path("/");
          }, function(error) {
            errorsHandling(error);
          });
      }
      else {
        $http
          .post("/api/v1/dissertations", $scope.dissertation)
          .then(function(response) {
            console.log(response);
            $rootScope.successMessage = "The dissertation has been created successfully.";
            $location.path("/");
          }, function(error) {
            errorsHandling(error);
          });
      }
    }

    var errorsHandling = function(error) {
      if (error.status == "400") {
        $scope.errorMessage = "There was a problem with the dissertation identifier. Please make sure this dissertation exists."
      }
      else if (error.status == "422") {
        $scope.errorMessage = "There are errors in your form."
      }
      else {
        $scope.errorMessage = "An unexpected error has occurred."
      }
    }
  }]);
