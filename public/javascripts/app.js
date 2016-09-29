/**
 * Created by Javier on 27/09/2016.
 */

'use strict';

angular.module('Pinya', ['ui.router', 'ngDraggable'])
    .config(function ($urlRouterProvider, $stateProvider) {

        $urlRouterProvider
            .otherwise('/');
        $stateProvider
            .state('home',{
                url: '',
                templateUrl: 'views/home.html',
                redirectTo: "home.home",
                controller: "HomeController",
                controllerAs: "HomeCtrl"
            })
            .state('home.home', {
                url: '/home',
                templateUrl: 'views/home/home.html'
            })
            .state('home.pinyas', {
                url: '/pinyas',
                templateUrl: 'views/home/pinyas.html',
                controller: "PinyasController",
                controllerAs: "PinyasCtrl"
            })
            .state('home.users', {
                url: '/users',
                templateUrl: 'views/home/users.html'
            })
            .state('home.about', {
                url: '/about',
                templateUrl: 'views/home/about.html'
            })
            .state('home.contact', {
                url: '/contact',
                templateUrl: 'views/home/contact.html'
            });
    })
    .run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams ) {

        $rootScope.$on('$stateChangeStart', function (evt, to, params) {
            if (to.redirectTo) {
                evt.preventDefault();
                $state.go(to.redirectTo, params, {location: 'replace'});
            }
        });

        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }]);