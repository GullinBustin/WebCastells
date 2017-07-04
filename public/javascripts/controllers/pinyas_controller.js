/**
 * Created by Javier on 27/09/2016.
 */

'use strict';

angular.module('Pinya')
    .controller('PinyasController', ['$state', '$http', 'PinyasService',function($state, $http, PinyasService){

        var controller = this;

        controller.pinyas = PinyasService;

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
            var maxSize = Math.max(size[0] , size[1])*9/10;
            if(size[0] < size[1]) rot+=90;
            if(rot > 80) rot-=180;
            if(rot < -100) rot+=180;
            ctx.translate(pos[0], pos[1]);
            ctx.rotate(rot*Math.PI/180);
            ctx.font='18px Arial';
            ctx.fillText(name,0,0, maxSize);
            ctx.setTransform(1,0,0,1,0,0);


        };

        var getName = function (pos) {
            var newKey;
            if(pos.length == 2){
                newKey = pos[0]+"_"+pos[1];
            }
            if(pos.length == 3){
                newKey = pos[0]+"_"+pos[1]+"_"+pos[2];
            }
            if(pos.length == 4){
                newKey = pos[0]+"_"+pos[1]+"_"+pos[2]+"_"+pos[3];
            }
            return controller.pinyas.pinyaTresName[newKey];
            /*
            if(pos.length == 2){
                return controller.pinyas.pinyaTresName[pos[0]][pos[1]];
            }
            if(pos.length == 3){
                return controller.pinyas.pinyaTresName[pos[0]][pos[1]][pos[2]];
            }
            if(pos.length == 4){
                return controller.pinyas.pinyaTresName[pos[0]][pos[1]][pos[2]][pos[3]];
            }
            */
        };

        var setName = function (pos, name) {
            var newKey;
            if(pos.length == 2){
                newKey = pos[0]+"_"+pos[1];
            }
            if(pos.length == 3){
                newKey = pos[0]+"_"+pos[1]+"_"+pos[2];
            }
            if(pos.length == 4){
                newKey = pos[0]+"_"+pos[1]+"_"+pos[2]+"_"+pos[3];
            }
            controller.pinyas.pinyaTresName[newKey] = name;

            /*
            if(pos.length == 2){
                controller.pinyas.pinyaTresName[pos[0]][pos[1]] = name;
            }
            if(pos.length == 3){
                controller.pinyas.pinyaTresName[pos[0]][pos[1]][pos[2]] = name;
            }
            if(pos.length == 4){
                controller.pinyas.pinyaTresName[pos[0]][pos[1]][pos[2]][pos[3]] = name;
            }
            */
        };

        var canvas = document.getElementById('pinyaCanvas');

        var ctx = canvas.getContext("2d");

        ctx.textAlign="center";


        controller.firstDraw = function () {
            var  i = 0, r;
            ctx.clearRect(0, 0, canvas.width, canvas.height); // for demo
            while(r = controller.pinyas.pinyaTresRect[i++]) {
                ctx.beginPath();
                drawRect(ctx, r.rect[0], r.rect[1], r.rect[2]);//ctx.rect(r.x, r.y, r.w, r.h);
                ctx.fillStyle = "rgb("+cPosicio[r.pos[0]][0]+","+cPosicio[r.pos[0]][1]+","+cPosicio[r.pos[0]][2]+")";
                ctx.fill();
                drawName(ctx, r.rect[0], r.rect[1], r.rect[2], getName(r.pos));
            }

        };

        if( controller.pinyas.pinyaTresRect.length == 0){
            controller.pinyas.registerObserverCallback(controller.firstDraw);

        }else{
            controller.firstDraw();
        }

        var isMousePressed = false;
        var isMouseDraged = false;
        var isItemSelected = false;
        var nItemSelected = -1;
        controller.nameSelected = null;


        canvas.onmousemove = function(e) {
            // important: correct mouse position:
            if(!isMousePressed && !isItemSelected) {
                var rect = this.getBoundingClientRect(),
                    x = e.clientX - rect.left,
                    y = e.clientY - rect.top,
                    i = 0, r;

                var realX = Math.round(x / rect.width * canvas.width);
                var realY = Math.round(y / rect.height * canvas.height);

                ctx.clearRect(0, 0, canvas.width, canvas.height);

                var onlyOne = true;
                while (r = controller.pinyas.pinyaTresRect[i++]) {
                    // add a single rect to path:
                    ctx.beginPath();

                    drawRect(ctx, r.rect[0], r.rect[1], r.rect[2]);

                    // check if we hover it, fill red, if not fill it blue
                    if (ctx.isPointInPath(realX, realY) && onlyOne) {
                        ctx.fillStyle = "rgb(100,100,100)";
                        var span = document.getElementById('showPos');
                        span.textContent = r.pos;
                        onlyOne = false;
                    } else {
                        ctx.fillStyle = "rgb(" + cPosicio[r.pos[0]][0] + "," + cPosicio[r.pos[0]][1] + "," + cPosicio[r.pos[0]][2] + ")";
                    }

                    ctx.fill();

                    drawName(ctx, r.rect[0], r.rect[1], r.rect[2], getName(r.pos));

                }
            }else{
                if(isMousePressed) {
                    isMouseDraged = true;
                }
                if(isMouseDraged) {
                    var rect = this.getBoundingClientRect(),
                        x = e.clientX - rect.left,
                        y = e.clientY - rect.top,
                        i = 0, r;

                    var realX = x / rect.width * canvas.width;
                    var realY = y / rect.height * canvas.height;

                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    var booleanName = true;

                    while (r = controller.pinyas.pinyaTresRect[i++]) {
                        // add a single rect to path:
                        ctx.beginPath();

                        drawRect(ctx, r.rect[0], r.rect[1], r.rect[2]);

                        var name;

                        if (i - 1 == nItemSelected) {
                            ctx.fillStyle = "rgb(0,255,0)";
                            var span = document.getElementById('showPos');
                            span.textContent = r.pos;
                            name = r.pos;
                        } else {
                            if (ctx.isPointInPath(realX, realY)) {
                                ctx.fillStyle = "rgb(0,255,0)";
                                var span = document.getElementById('showPos');
                                span.textContent = r.pos;
                                name = controller.pinyas.pinyaTresRect[nItemSelected].pos;
                                booleanName = false;
                            } else {
                                name = r.pos;
                                ctx.fillStyle = "rgb(" + cPosicio[r.pos[0]][0] + "," + cPosicio[r.pos[0]][1] + "," + cPosicio[r.pos[0]][2] + ")";
                            }
                        }

                        ctx.fill();

                        if (i - 1 != nItemSelected) drawName(ctx, r.rect[0], r.rect[1], r.rect[2], getName(name));

                    }
                    var tempItem = controller.pinyas.pinyaTresRect[nItemSelected];
                    if(booleanName) drawName(ctx, [realX, realY], tempItem.rect[1], tempItem.rect[2], getName(tempItem.pos));
                }
            }

        };

        canvas.onmousedown = function (e) {
            // important: correct mouse position:
            var rect = this.getBoundingClientRect(),
                x = e.clientX - rect.left,
                y = e.clientY - rect.top,
                i = 0, r;


            var realX = x / rect.width * canvas.width;
            var realY = y / rect.height * canvas.height;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            var nowIsPressed = false;
            var nowIsSelected = false;

            var reDraw = false;

            var onlyOne = true;
            while(r = controller.pinyas.pinyaTresRect[i++]) {
                // add a single rect to path:
                ctx.beginPath();

                drawRect(ctx, r.rect[0], r.rect[1], r.rect[2]);

                // check if we hover it, fill red, if not fill it blue

                if(ctx.isPointInPath(realX, realY) && onlyOne){

                    if(controller.nameSelected == null) {

                        if (isItemSelected) {
                            ctx.fillStyle = "rgb("+cPosicio[r.pos[0]][0]+","+cPosicio[r.pos[0]][1]+","+cPosicio[r.pos[0]][2]+")";

                            var tname1 = getName(r.pos);
                            var tname2 = getName(controller.pinyas.pinyaTresRect[nItemSelected].pos);

                            setName(r.pos, tname2);
                            setName(controller.pinyas.pinyaTresRect[nItemSelected].pos, tname1);
                            ctx.fillStyle = "rgb(0,255,0)";
                            var span = document.getElementById('showPos');
                            span.textContent = r.pos;
                            nowIsPressed = false;
                            nowIsSelected = false;
                            nItemSelected = -1;
                            reDraw = true;
                        } else {
                            ctx.fillStyle = "rgb(0,255,0)";
                            var span = document.getElementById('showPos');
                            span.textContent = r.pos;
                            nowIsPressed = true;
                            nowIsSelected = true;
                            nItemSelected = i - 1;
                        }
                    }else{

                        ctx.fillStyle = "rgb("+cPosicio[r.pos[0]][0]+","+cPosicio[r.pos[0]][1]+","+cPosicio[r.pos[0]][2]+")";

                        for(var key in controller.pinyas.pinyeros){
                            if(controller.pinyas.pinyeros[key].name == controller.nameSelected){
                                controller.pinyas.pinyeros[key].chosed = true;
                            }
                        }

                        var name = controller.nameSelected;

                        for(var key in controller.pinyas.pinyeros){
                            if(controller.pinyas.pinyeros[key].name == getName(r.pos)){
                                controller.pinyas.pinyeros[key].chosed = false;
                            }
                        }

                        setName(r.pos, name);

                    }
                    onlyOne = false;
                }else{
                    ctx.fillStyle = "rgb("+cPosicio[r.pos[0]][0]+","+cPosicio[r.pos[0]][1]+","+cPosicio[r.pos[0]][2]+")";
                }


                ctx.fill();

                drawName(ctx, r.rect[0], r.rect[1] ,r.rect[2], getName(r.pos));

            }

            isMousePressed = nowIsPressed;
            isItemSelected = nowIsSelected;
            controller.nameSelected = null;

            if(reDraw) controller.firstDraw();

        };

        canvas.onmouseup = function (e) {

            if(isMouseDraged){
                console.log(nItemSelected);

                var rect = this.getBoundingClientRect(),
                    x = e.clientX - rect.left,
                    y = e.clientY - rect.top,
                    i = 0, r;

                var realX = x / rect.width * canvas.width;
                var realY = y / rect.height * canvas.height;

                ctx.clearRect(0, 0, canvas.width, canvas.height); // for demo

                var onlyOne = true;
                while(r = controller.pinyas.pinyaTresRect[i++]) {
                    // add a single rect to path:
                    ctx.beginPath();

                    drawRect(ctx, r.rect[0], r.rect[1], r.rect[2]);

                    // check if we hover it, fill red, if not fill it blue

                    if(ctx.isPointInPath(realX, realY) && onlyOne){
                        ctx.fillStyle =  "rgb(0,255,0)";
                        var span = document.getElementById('showPos');
                        span.textContent = r.pos;

                        var tname1 = getName(r.pos);
                        var tname2 = getName(controller.pinyas.pinyaTresRect[nItemSelected].pos);

                        setName(r.pos, tname2);
                        setName(controller.pinyas.pinyaTresRect[nItemSelected].pos, tname1);

                        onlyOne = false;
                    }else{
                        ctx.fillStyle = "rgb("+cPosicio[r.pos[0]][0]+","+cPosicio[r.pos[0]][1]+","+cPosicio[r.pos[0]][2]+")";
                    }

                    ctx.fill();

                    drawName(ctx, r.rect[0], r.rect[1] ,r.rect[2], getName(r.pos));

                }

                isMousePressed = false;
                isMouseDraged = false;
                isItemSelected = false;
                nItemSelected = -1;
            }else{
                isMousePressed = false;
            }
        };



        controller.drag = function(data,evt) {
            console.log("drag success, data:", data);
        };

        controller.dragMove = function(data,evt) {

            var eventX = 0, eventY = 0;

            if(evt.event.constructor == MouseEvent){
                eventX = evt.event.clientX;
                eventY = evt.event.clientY;
            }
            if(evt.event.constructor == TouchEvent){
                eventX = evt.event.changedTouches[0].clientX;
                eventY = evt.event.changedTouches[0].clientY;
            }

            var rect = canvas.getBoundingClientRect(),
                //x = evt.event.clientX - rect.left,
                //y = evt.event.clientY - rect.top,
                x = eventX - rect.left,
                y = eventY - rect.top,
                i = 0, r;

            var realX = x / rect.width * canvas.width;
            var realY = y / rect.height * canvas.height;

            ctx.clearRect(0, 0, canvas.width, canvas.height); // for demo

            var onlyOne = true;
            while(r = controller.pinyas.pinyaTresRect[i++]) {
                // add a single rect to path:
                ctx.beginPath();

                drawRect(ctx, r.rect[0], r.rect[1], r.rect[2]);

                var name;

                if(ctx.isPointInPath(realX, realY) && onlyOne){
                    ctx.fillStyle =  "rgb(0,255,0)";
                    var span = document.getElementById('showPos');
                    span.textContent = r.pos;
                    name = data.name;
                    onlyOne = false;
                }else{
                    ctx.fillStyle = "rgb("+cPosicio[r.pos[0]][0]+","+cPosicio[r.pos[0]][1]+","+cPosicio[r.pos[0]][2]+")";
                    name = getName(r.pos);
                }

                ctx.fill();

                drawName(ctx, r.rect[0], r.rect[1] ,r.rect[2], name);
            }

        };

        controller.drop = function(data,evt) {

            var eventX = 0, eventY = 0;

            if(evt.event.constructor == MouseEvent){
                eventX = evt.event.clientX;
                eventY = evt.event.clientY;
            }
            if(evt.event.constructor == TouchEvent){
                eventX = evt.event.changedTouches[0].clientX;
                eventY = evt.event.changedTouches[0].clientY;
            }

            var rect = canvas.getBoundingClientRect(),
                //x = evt.event.clientX - rect.left,
                //y = evt.event.clientY - rect.top,
                x = eventX - rect.left,
                y = eventY - rect.top,
                i = 0, r;

            var realX = x / rect.width * canvas.width;
            var realY = y / rect.height * canvas.height;


            ctx.clearRect(0, 0, canvas.width, canvas.height); // for demo

            var onlyOne = true;
            while(r = controller.pinyas.pinyaTresRect[i++]) {
                // add a single rect to path:
                ctx.beginPath();

                drawRect(ctx, r.rect[0], r.rect[1], r.rect[2]);

                var name;

                if(ctx.isPointInPath(realX, realY) && onlyOne){
                    ctx.fillStyle =  "rgb(0,255,0)";
                    var span = document.getElementById('showPos');
                    span.textContent = r.pos;
                    name = data.name;

                    data.chosed = true;

                    for(var key in controller.pinyas.pinyeros){
                        if(controller.pinyas.pinyeros[key].name == getName(r.pos)){
                            controller.pinyas.pinyeros[key].chosed = false;
                        }
                    }

                    setName(r.pos, name);
                    onlyOne = false;
                }else{
                    ctx.fillStyle = "rgb("+cPosicio[r.pos[0]][0]+","+cPosicio[r.pos[0]][1]+","+cPosicio[r.pos[0]][2]+")";
                    name = getName(r.pos);
                }

                ctx.fill();

                drawName(ctx, r.rect[0], r.rect[1] ,r.rect[2], name);

            }

        };


        controller.selectItem = function (item) {
            if(isItemSelected){

                for(var key in controller.pinyas.pinyeros){
                    if(controller.pinyas.pinyeros[key].name == getName(controller.pinyas.pinyaTresRect[nItemSelected].pos)){
                        controller.pinyas.pinyeros[key].chosed = false;
                    }
                }

                setName(controller.pinyas.pinyaTresRect[nItemSelected].pos, item.name);
                isItemSelected = false;
                nItemSelected = -1;
                item.chosed = true;

                controller.firstDraw();
            }else{

                controller.nameSelected = item.name;

            }

        };

        controller.generatePinya = function(){
            controller.pinyas.generatePinyaTres(controller.firstDraw);
        };

    }]);