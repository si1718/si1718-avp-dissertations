var app = angular.module("DissertationsApp", ["ngRoute", "ngAnimate", "ui.bootstrap"])
    .config(function($routeProvider) { // esto es lo que se va a cargar al lanzar la aplicación
        $routeProvider
            .when("/", {
                templateUrl: "list.html",
                controller:"ListCtrl"
            })
        console.log("App Initialized");

    });
