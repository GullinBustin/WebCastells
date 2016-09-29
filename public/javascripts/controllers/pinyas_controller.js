/**
 * Created by Javier on 27/09/2016.
 */

'use strict';

angular.module('Pinya')
    .controller('PinyasController', ['$state',function($state){

        var cPosicio = {
            "agulla": [0, 255, 255],
            "baix": [255, 0, 0],
            "contrafort": [255, 106, 0],
            "mans": [255, 216, 0],
            "crosses": [182, 255, 0],
            "laterals": [127, 0, 110],
            "vent": [0, 38, 255]
        };

        var selectC = [0,255,0];

        var passC = [0,0,0];

        var getAbsPosition = function(key, val){
          if(key == 'agulla'){
              return {pos: "agulla", fila: val[0]};
          }
          if(key == 'baix'){
              return {pos: "baix", fila: val[2]};
          }
          if(key == "contrafort"){
              return {pos: "contrafort", fila: val[2]};
          }
          if(key == "mans"){
              return {pos: "mans", fila: val[2], cordo: val[1]-cPosicio[key][1]};
          }
          if(key == "crosses"){
              return {pos: 'crosses', fila: val[2], costat: val[1]-cPosicio[key][1]};
          }
          if(key == "laterals"){
              return {pos: 'laterals', fila: val[2]-cPosicio[key][2], costat: val[0]-cPosicio[key][0], cordo: val[1]};
          }
          if(key == "vent"){
              return {pos : "vent", fila: val[1]-cPosicio[key][1], cordo: val[0]};
          }
        };

        var controller = this;

        controller.showPos = "";

        var canvas = document.getElementById('pinyaCanvas');

        var ctx = canvas.getContext("2d");

        var imageObj = new Image();

        imageObj.onload = function() {
            canvas.width = imageObj.width;
            canvas.height = imageObj.height;
            ctx.drawImage(imageObj, 0, 0);
        };
        imageObj.src = 'images/newPinya3-lit.png';

        var clickBool = false;

        canvas.onmousemove = function(e) {

            if(!clickBool) {
                // important: correct mouse position:
                var rect = canvas.getBoundingClientRect(),
                    x = e.clientX - rect.left,
                    y = e.clientY - rect.top;

                var realX = x / rect.width * canvas.width,
                    realY = y / rect.height * canvas.height;

                var p = ctx.getImageData(realX, realY, 1, 1).data;


                if (p[0] == selectC[0] && p[1] == selectC[1] && p[2] == selectC[2]) {

                } else {

                    if (passC[0] != 0 || passC[1] != 0 || passC[2] != 0) {

                        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        var data = imageData.data;

                        for (var i = 0; i < data.length; i += 4) {
                            if (data[i] == selectC[0] && data[i + 1] == selectC[1] && data[i + 2] == selectC[2]) {
                                data[i] = passC[0];
                                data[i + 1] = passC[1];
                                data[i + 2] = passC[2];
                            }
                        }
                        ctx.putImageData(imageData, 0, 0);

                        passC = [0, 0, 0];
                    }

                    for (var key in cPosicio) {
                        if (Math.abs(cPosicio[key][0] - p[0]) + Math.abs(cPosicio[key][1] - p[1]) + Math.abs(cPosicio[key][2] - p[2]) < 10) {
                            touchPos(key, [p[0], p[1], p[2]]);
                        }
                    }

                }
            }
        };

        canvas.onmousedown = function(e){
            // important: correct mouse position:
            var rect = canvas.getBoundingClientRect(),
                x = e.clientX - rect.left,
                y = e.clientY - rect.top;

            var realX = x/rect.width * canvas.width,
                realY = y/rect.height * canvas.height;

            var p = ctx.getImageData(realX, realY, 1, 1).data;


            if(p[0] == selectC[0] && p[1] == selectC[1] && p[2] == selectC[2]){
                clickBool = true;
            }else {

                if(passC[0] != 0 || passC[1] != 0 || passC[2] != 0){

                    var imageData = ctx.getImageData(0,0,canvas.width, canvas.height);
                    var data = imageData.data;
                    for (var i = 0; i < data.length; i += 4) {
                        if(data[i] == selectC[0] && data[i+1] == selectC[1] && data[i+2] == selectC[2] ){
                            data[i] = passC[0];
                            data[i+1] = passC[1];
                            data[i+2] = passC[2];
                        }
                    }
                    ctx.putImageData(imageData, 0, 0);

                    passC = [0,0,0];
                }

                clickBool = false;
                for (var key in cPosicio) {
                    if (Math.abs(cPosicio[key][0] - p[0]) + Math.abs(cPosicio[key][1] - p[1]) + Math.abs(cPosicio[key][2] - p[2]) < 10) {
                        touchPos(key, [p[0], p[1], p[2]]);
                        clickBool = true;

                    }
                }

            }

        };


        var touchPos = function (key, val) {
            var pos = getAbsPosition(key, val);

            var span = document.getElementById('showPos');
            span.textContent = pos.pos+", "+pos.fila+", "+pos.cordo+", "+pos.costat;

            //controller.showPos = span.textContent;

            var imageData = ctx.getImageData(0,0,canvas.width, canvas.height);
            var data = imageData.data;

            for (var i = 0; i < data.length; i += 4) {
                if(data[i] == val[0] && data[i+1] == val[1] && data[i+2] == val[2] ){
                    data[i] = selectC[0];
                    data[i+1] = selectC[1];
                    data[i+2] = selectC[2];
                }
            }
            ctx.putImageData(imageData, 0, 0);
            passC = val;

        }


        controller.men = [
            "luis",
            "jose luis",
            "mega luis"
        ];

        controller.drag = function(data,evt) {
            console.log("drag success, data:", data);
        };

        controller.drop = function(data,evt) {
            console.log("drop success, data:", data);

            console.log(evt);
            var rect = canvas.getBoundingClientRect(),
                x = evt.event.clientX - rect.left,
                y = evt.event.clientY - rect.top;
            console.log(x);
            console.log(y);

            var realX = x / rect.width * canvas.width,
                realY = y / rect.height * canvas.height;

            //var p = passC;
            var p = ctx.getImageData(realX, realY, 1, 1).data;

            if(p[0] == selectC[0] && p[1] == selectC[1] && p[2] == selectC[2]){
                p = passC;
            }

            //var span = document.getElementById('showPos');
            //span.textContent = realX+"/"+realY;

            for (var key in cPosicio){

                if (Math.abs(cPosicio[key][0] - p[0]) + Math.abs(cPosicio[key][1] - p[1]) + Math.abs(cPosicio[key][2] - p[2]) < 10) {
                    console.log(key);
                    var pos = getAbsPosition(key, [p[0], p[1], p[2]]);
                    //var span = document.getElementById('showPos');
                    //span.textContent = pos.pos+", "+pos.fila+", "+pos.cordo+", "+pos.costat;
                }
            }

        };

    }]);