var app = angular.module("DissertationsApp", ["ngRoute", "ngAnimate", "ui.bootstrap"])
    .config(function($routeProvider) { // esto es lo que se va a cargar al lanzar la aplicación
        $routeProvider
            .when("/", {
                templateUrl: "list.html",
                controller: "ListCtrl"
            })
            .when("/dissertations/:idDissertation/edit", {
                templateUrl: "edit.html",
                controller: "EditCtrl"
            })
            .when("/dissertations/create", {
                templateUrl: "edit.html",
                controller: "EditCtrl"
            }).when("/graph", {
                templateUrl: "graph.html",
                controller: "GraphCtrl"
            });
        console.log("App Initialized");

    });
