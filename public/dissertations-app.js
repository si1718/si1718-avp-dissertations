var app = angular.module("DissertationsApp", ["ngRoute", "ngAnimate", "ui.bootstrap"])
    .config(function($routeProvider) { // esto es lo que se va a cargar al lanzar la aplicación
        $routeProvider
            .when("/", {
                templateUrl: "list.html",
                controller:"ListCtrl"
            })
            .when("/dissertation/:idDissertation/edit", {
                templateUrl: "edit.html",
                controller: "EditCtrl"
            })
            .when("/dissertation/create", {
                templateUrl: "edit.html",
                controller: "EditCtrl"
            });
        console.log("App Initialized");

    });
