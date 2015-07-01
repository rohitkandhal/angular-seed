window.vjs = window.vjs || {};

(function(ns) {
    'use strict';

    angular.module(APPNAME, ['ngRoute'])

        .config(['$routeProvider', function($routeProvider) {
          $routeProvider.when('/home', {
            templateUrl: 'home/home.html',
            controller: 'HomeController'
          });
        }])

        .controller('HomeController', HomeController);

    function HomeController() {
        this.homeModel = new ns.HomeModel();
        this.homeModel.currTypeId = 5;
    }

}(window.vjs));
