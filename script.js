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
var treasure;
var uLoc;
var notFoundIt = true;
var username;
var bod = document.body;
var score = 0;
var q = window, uColor;
var now, dt,
    last = timestamp();
requestAnimationFrame = q.requestAnimationFrame || q.webkitRequestAnimationFrame || q.msRequestAnimationFrame || q.mozRequestAnimationFrame;

function init(){
    canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth - 16;
    canvas.height = window.innerHeight - 16;
    context = canvas.getContext('2d');
    treasure = createTreasure();

    w = canvas.width;
    h = canvas.height;
    block_x = w / 2 - 15;
    block_y = h /2 - 15;

    requestAnimationFrame(frame);
}

function run(){
    value: false
}


function frame() {
    if(run.value) {
        now = timestamp();
        dt = (now - last) / 1000;    // duration in seconds
        draw(dt);
        last = now;
        requestAnimationFrame(frame);
    }
}


function stopGame(){
    run.value = !run.value;
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
    uLoc = {x: block_x, y: block_y};

    var relay = checkForWin();
    if(relay == false){
        //if user has found it
        console.log(username + " found the treasure!");
        ++score;
        stopGame();
        setTimeout(reset, 10000);
    }
}

function timestamp() {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
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

//window.onresize = resize;

function resize() {
    console.log("resize event detected!");
    canvas.width = window.innerWidth - 16;
    canvas.height = window.innerHeight - 16;
    w = canvas.width;
    h = canvas.height;
}

function createTreasure(){
    console.log('generating prize location');
    var treasure = {x: null, y: null };
    treasure.x = randomize(0, canvas.width);
    treasure.y = randomize(0, canvas.height);
    treasure.width = 10;
    treasure.height = 10;

    context.fillStyle="#F2293A";
    context.fillRect(treasure.x,treasure.y,block_w,block_h);
    context.fill();
    console.log(treasure);
    return treasure;
}

function randomize(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function checkForWin(){
    var relay;
    if (uLoc.x < treasure.x -10 + treasure.width + 10  && uLoc.x + treasure.width + 10  > treasure.x - 10 &&
        uLoc.y < treasure.y - 10 + treasure.height + 10 && uLoc.y + treasure.height + 10 > treasure.y - 10) {

    // The objects are touching
        relay = !notFoundIt;
    }
    return relay;
    // TODO: if (!notFoundIt) {socket.emit user name to server, server broadcast winner's name to all users}
}

// If the server broadcasts a win, reset the game


// After game over, server will emit the username to all users. browser will append name to users.

function announceWinner(user){
    var u = user.toString();
    var x = document.createElement("p");
    var t = document.createTextNode(u + " is the checkForWin!");
    x.appendChild(t);
    bod.appendChild(x);
}

function reset(){
    clearCanvas();
    window.setTimeout(function() {
        treasure = createTreasure();
        block_x = innerWidth / 2;
        block_y = innerHeight / 2;
        notFoundIt = true;
    }, 10000);
}
// TODO: place name from user input into cname value. will be able to save user info.

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
    }
    return "";
}

function checkCookie() {
    var user=getCookie("username");
    if (user != "") {
        alert("Welcome again " + user);
    } else {
        user = prompt("Please enter your name:","");
        if (user != "" && user != null) {
            setCookie("username", user, 30);
        }
    }
}

function startGame(){}