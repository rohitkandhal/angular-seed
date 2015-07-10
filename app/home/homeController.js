window.vjs = window.vjs || {};

(function(ns) {
    'use strict';

    angular.module(APPNAME, ['ngRoute'])

        .config(['$routeProvider', function($routeProvider) {
          $routeProvider.when('/home', {
            templateUrl: 'home/home.html'
          });
        }])

        .controller('HomeController', HomeController);

    function HomeController() {
        if(!this.homeModel){
            this.homeModel = new ns.HomeModel();
        }        
    }

}(window.vjs));
