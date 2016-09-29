/**
 * Created by Javier on 27/09/2016.
 */

'use strict';

angular.module('Pinya')
    .controller('HomeController', ['$state',function($state){

        var controller = this;

        controller.goTo = function(name){
            $state.go("home."+name);
            console.log(name);
        };

        controller.isState= function(name){
            return "home."+name == $state.current.name;
        };

    }]);