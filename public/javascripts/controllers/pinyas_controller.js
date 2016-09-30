/**
 * Created by Javier on 27/09/2016.
 */

'use strict';

angular.module('Pinya')
    .controller('PinyasController', ['$state', '$http',function($state, $http){

        var cPosicio = {
            "agulla": [0, 255, 255],
            "baix": [255, 0, 0],
            "contrafort": [255, 106, 0],
            "mans": [255, 216, 0],
            "crosses": [182, 255, 0],
            "lateral": [127, 0, 110],
            "vent": [0, 38, 255]
        };


        var drawRect = function (ctx, pos, size, rot) {
            ctx.translate(pos[0], pos[1]);
            ctx.rotate(rot*Math.PI/180);
            ctx.rect(-size[0]/2, -size[1]/2, size[0], size[1]);
            ctx.setTransform(1,0,0,1,0,0);

        };

        var drawName = function (ctx, pos, size ,rot, name) {

            ctx.fillStyle="black";
            var maxSize = Math.max(size[0] , size[1]);
            if(size[0] < size[1]) rot+=90;
            if(rot > 80) rot-=180;
            if(rot < -100) rot+=180;
            ctx.translate(pos[0], pos[1]);
            ctx.rotate(rot*Math.PI/180);
            ctx.font='18px Arial';
            ctx.fillText(name,0,0, maxSize);
            ctx.setTransform(1,0,0,1,0,0);


        };

        var controller = this;

        controller.showPos = "";

        var canvas = document.getElementById('pinyaCanvas');

        var ctx = canvas.getContext("2d");

        ctx.textAlign="center";

        var rects = [], i = 0, r;


        $http.get('images/tres.json').success(function (data) {
            rects = data;
            console.log(rects);
            firstDraw();
        });

        var firstDraw = function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // for demo
            while(r = rects[i++]) {
                ctx.beginPath();
                drawRect(ctx, r.rect[0], r.rect[1], r.rect[2]);//ctx.rect(r.x, r.y, r.w, r.h);
                ctx.fillStyle = "rgb("+cPosicio[r.pos[0]][0]+","+cPosicio[r.pos[0]][1]+","+cPosicio[r.pos[0]][2]+")";
                ctx.fill();
                drawName(ctx, r.rect[0], r.rect[1], r.rect[2], r.pos[0]);
            }

        };


        canvas.onmousemove = function(e) {

            // important: correct mouse position:
            var rect = this.getBoundingClientRect(),
                x = e.clientX - rect.left,
                y = e.clientY - rect.top,
                i = 0, r;

            var realX = x / rect.width * canvas.width;
            var realY = y / rect.height * canvas.height;

            ctx.clearRect(0, 0, canvas.width, canvas.height); // for demo

            while(r = rects[i++]) {
                // add a single rect to path:
                ctx.beginPath();

                drawRect(ctx, r.rect[0], r.rect[1], r.rect[2]);

                // check if we hover it, fill red, if not fill it blue
                if(ctx.isPointInPath(realX, realY)){
                    ctx.fillStyle =  "green";
                    var span = document.getElementById('showPos');
                    span.textContent = r.pos;
                }else{
                    ctx.fillStyle = "rgb("+cPosicio[r.pos[0]][0]+","+cPosicio[r.pos[0]][1]+","+cPosicio[r.pos[0]][2]+")";
                }

                ctx.fill();

                drawName(ctx, r.rect[0], r.rect[1] ,r.rect[2], r.pos[0]);

            }

        };


        var touchPos = function (key, val) {
            var pos = getAbsPosition(key, val);

            var span = document.getElementById('showPos');
            span.textContent = pos.pos+", "+pos.fila+", "+pos.cordo+", "+pos.costat;

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

        };


        controller.men = [
            "luis",
            "jose luis",
            "mega luis"
        ];

        controller.drag = function(data,evt) {
            console.log("drag success, data:", data);
        };

        controller.dragMove = function(data,evt) {
            console.log("drag success, data:", data);


            var rect = canvas.getBoundingClientRect(),
                x = evt.event.clientX - rect.left,
                y = evt.event.clientY - rect.top,
                i = 0, r;

            var realX = x / rect.width * canvas.width;
            var realY = y / rect.height * canvas.height;

            ctx.clearRect(0, 0, canvas.width, canvas.height); // for demo

            while(r = rects[i++]) {
                // add a single rect to path:
                ctx.beginPath();

                drawRect(ctx, r.rect[0], r.rect[1], r.rect[2]);

                var name;

                if(ctx.isPointInPath(realX, realY)){
                    ctx.fillStyle =  "green";
                    var span = document.getElementById('showPos');
                    span.textContent = r.pos;
                    name = data.name;
                }else{
                    ctx.fillStyle = "rgb("+cPosicio[r.pos[0]][0]+","+cPosicio[r.pos[0]][1]+","+cPosicio[r.pos[0]][2]+")";
                    name = r.pos[0];
                }

                ctx.fill();

                drawName(ctx, r.rect[0], r.rect[1] ,r.rect[2], name);

            }

        };

        controller.drop = function(data,evt) {
            console.log("drop success, data:", data);

        };


    }]);