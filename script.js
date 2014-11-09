/**
 * Created by Isi on 11/8/14.
 */

var context;
var canvas;
var w, h;
var rightKey = false;
var leftKey = false;
var upKey = false;
var downKey = false;
var block_x;
var block_y;
var block_h = 10;
var block_w = 10;

function init(){
    canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth - 16;
    canvas.height = window.innerHeight - 16;
    context = canvas.getContext('2d');
    w = canvas.width;
    h = canvas.height;
    block_x = w / 2 - 15;
    block_y = h /2 - 15;
    setInterval('draw()', 25);
}

function clearCanvas() {
    context.clearRect(0,0,w,h);
}


function draw() {
    //clearCanvas();
    if (rightKey) {
        block_x += 5;
    }
    else if (leftKey) {
        block_x -= 5;
    }
    if (upKey) {
        block_y -= 5;
    }
    else if (downKey) {
        block_y += 5;
    }
    if (block_x <= 0) {
        block_x = 0;
    }
    if ((block_x + block_w) >= w) {
        block_x = w - block_w;
    }
    if (block_y <= 0) {
        block_y = 0;
    }
    if ((block_y + block_h) >= h) {
        block_y = h - block_h;
    }

    //context.fillRect(block_x,block_y,block_w,block_h);
    context.beginPath();
    context.arc(block_x, block_y, block_w/3, 0, 2 * Math.PI, false);
    context.fillStyle="#3D3C3D";
    context.fill();



    //context.stroke();
}

window.onkeydown = function (evt) {
    if (!evt) {
        evt = window.event;
    }

    var code = evt.keyCode;

    if (code == 39) {
        rightKey = true;
        console.log('right');
    }
    else if (code == 37) {
        leftKey = true;
        console.log('left');
    }
    if (code == 38) {
        upKey = true;
        console.log('up');
    }
    else if (code == 40) {
        downKey = true;
        console.log('down');
    }
};

window.onkeyup = function (evt) {

    if (!evt) {
        evt = window.event;
    }

    var code = evt.keyCode;

    if (code == 39) {
        rightKey = false;
    }

    else if (code == 37) {
        leftKey = false;
    }

    if (code == 38) {
        upKey = false;
    }

    else if (code == 40) {
        downKey = false;
    }
};

window.onresize = resize;

function resize() {
    console.log("resize event detected!");
    canvas.width = window.innerWidth - 16;
    canvas.height = window.innerHeight - 16;
    w = canvas.width;
    h = canvas.height;
}