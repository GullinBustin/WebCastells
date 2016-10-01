/**
 * Created by Javier on 30/09/2016.
 */

'use strict';

angular.module('Pinya')
    .service('PinyasService', function ($http) {
        var store = this;

        store.pinyaTresRect = [];
        store.pinyaTresName = {};


        var observerCallbacks = [];
        this.registerObserverCallback = function (callback) {
            observerCallbacks.push(callback);
        };

        var notifyObservers = function () {
            angular.forEach(observerCallbacks, function (callback) {
                callback();
            });
        };

        $http.get('images/tres.json').success(function (data) {
            store.pinyaTresRect = data;

            for (var key in data){
                var tempPos = data[key]["pos"];
                var newKey;
                if(tempPos.length == 2){
                    newKey = tempPos[0]+"_"+tempPos[1];
                }
                if(tempPos.length == 3){
                    newKey = tempPos[0]+"_"+tempPos[1]+"_"+tempPos[2];
                }
                if(tempPos.length == 4){
                    newKey = tempPos[0]+"_"+tempPos[1]+"_"+tempPos[2]+"_"+tempPos[3];
                }
                store.pinyaTresName[newKey] = "";
                /*
                var temp = data[key]["pos"];

                var obj = store.pinyaTresName;

                for( var i = 0; i < temp.length; i++){
                    if(obj[temp[i]]){

                    }else{
                        if(i == temp.length-1){
                            obj[temp[i]] = "";
                        }else{
                            obj[temp[i]] = {};
                        }
                    }
                    obj = obj[temp[i]];
                }
                */
            }

            console.log(store.pinyaTresName);
            notifyObservers();
        });


    });
