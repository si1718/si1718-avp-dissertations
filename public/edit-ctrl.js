angular.module("DissertationsApp")
  .controller("EditCtrl", ["$scope", "$http", "$routeParams", "$rootScope", "$location", "$uibModal", function($scope, $http, $routeParams, $rootScope, $location, $modal) {
    var idDissertation = $routeParams.idDissertation;
    $scope.idDissertation = idDissertation;

    if (idDissertation) {
      // call the api and get the dissertation
      $http
        .get("/api/v1/dissertations/" + idDissertation)
        .then(function(response) {
          var thisDissertation = response.data;
          if (!thisDissertation.keywords)
            thisDissertation.keywords = [];
          $scope.dissertation = thisDissertation;
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
        year: 2017,
        keywords: []
      }
    }

    $scope.deleteTutor = function(index) {
      $scope.dissertation.tutors.splice(index, 1);
    }

    $scope.addTutor = function() {
      $scope.dissertation.tutors.push($scope.tutorName);
      delete $scope.tutorName;
    }


    $scope.validateTutor = function(index) {
      validateResearcher(index, 'tutor');
    }

    $scope.validateAuthor = function(str) {
      validateResearcher(str, 'author');
    }

    $scope.editAuthor = function() {
      $scope.dissertation.author = "";
      delete $scope.dissertation.authorName;
      delete $scope.dissertation.authorViewURL;
    }

    var validateResearcher = function(str, type) {
      if (type === 'tutor')
        var researcherObj = $scope.dissertation.tutors[str];
      else
        var researcherObj = str;
      if (isUrl(researcherObj.url)) {
        $scope.errorMessage = "This researcher has already been validated.";
      }
      else if (isIdResearcher(researcherObj)) {
        console.log("AAAA");
        $http
          .get("https://si1718-dfr-researchers.herokuapp.com/api/v1/researchers/" + researcherObj)
          .then(function(response) {
            if (type === 'tutor') {
              $scope.dissertation.tutors[str] = {
                url: "https://si1718-dfr-researchers.herokuapp.com/api/v1/researchers/" + response.data.idResearcher,
                name: response.data.name,
                view: response.data.viewURL
              }
            }
            else {
              $scope.dissertation.author = "https://si1718-dfr-researchers.herokuapp.com/api/v1/researchers/" + response.data.idResearcher;
              $scope.dissertation.authorName = response.data.name;
              $scope.dissertation.authorViewURL = response.data.viewURL;
            }

          }, function(error) {
            if (error.status == '404')
              $scope.errorMessage = "The researcher couldn't be found with the specified identifier. You may try again by specifying the researcher's name.";
            else
              $scope.errorMessage = "Couldn't validate this researcher. Please try later.";
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
            $scope.dissertation.tutors[str] = {
              url: "https://si1718-dfr-researchers.herokuapp.com/api/v1/researchers/" + selectedItem.idResearcher,
              name: selectedItem.name,
              view: selectedItem.viewURL
            }
          }
          else {
            $scope.dissertation.author = "https://si1718-dfr-researchers.herokuapp.com/api/v1/researchers/" + selectedItem.idResearcher;
            $scope.dissertation.authorName = selectedItem.name;
            $scope.dissertation.authorViewURL = selectedItem.viewURL;
          }
        }, function() {
          console.log('Modal dismissed at: ' + new Date());
        });
      }
    }

    // click function for saving (call put or post depending on if there's idDissertation or not)
    $scope.send = function(dissertation) {
      if (typeof dissertation.keywords === 'string')
        dissertation.keywords = dissertation.keywords.split(",");
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
      else if (error.status == "404") {
        $scope.errorMessage = "Dissertation not found."
      }
      else {
        $scope.errorMessage = "An unexpected error has occurred."
      }
    }
  }]);
