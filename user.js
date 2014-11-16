/**
 * Created by Isi on 11/10/14.
 */

var context, canvas, w, h;
var userclass;
var val = {
    a: 0,
    b: 0,
    g: 0
};

var rightKey = false;
var leftKey = false;
var upKey = false;
var downKey = false;



requestAnimationFrame =  window.requestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.msRequestAnimationFrame ||
window.mozRequestAnimationFrame;

function init() {
    canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth - 16;
    canvas.height = window.innerHeight - 16;

    w = canvas.width;
    h = canvas.height;
    context = canvas.getContext('2d');

    var itemToFindLoc = {x: 233, y: 222};
    var userInfo = {n: "Regina", c: "#3D3C3D", s: 3};
    //userclass = new userParticle(itemToFindLoc, userInfo,  "socketID", val);
    userclass = new userParticle(width/2, height/2);

    var render = function () {
        //userclass.run();
        //var data = userclass.sendData();
        //console.log(data);
        context.beginPath();
//
//      console.log('generating user');
//      context.arc(this.block.x, this.block.y, this.block.w/this.user.size, 0, 2 * Math.PI, false);

        requestAnimationFrame(render);
        //console.log("hi");
        //console.log(val);

    };
    requestAnimationFrame(render);
}

//var userParticle = function(tre, user, socID, v){
//    this.treasure = tre;
//    this.val = v;
//    console.log(v);
//    this.block = {
//        x: w / 2 - 15,
//        y: h /2 - 15,
//        h: 10,
//        w: 10
//    };
//
//    this.user = {
//        name: null,
//        color: null,
//        size: 2
//    };
//
//    this.notFoundIt = true;
//    this.score = 0;
//    this.requestId = null;
//    this.socketId = socID;
//    this.last = timestamp();
//
//
//    this.run = run;
//    console.log(v);
//    //this.frames = frames;
//    this.update = update;
//    this.display = display;
//    this.sendData = sendData;
//
//    this.self = this;
//
//};

var userParticle = function(x,y){
    this.acc = new Victor(0,0);
    this.vel = new Victor(0,-2);
    this.pos = new Victor(x,y);
    this.r = 6;
    this.maxspeed = 4;
    this.maxforce = 0.3;

    this.update = update();
    this.seek = seek();
    this.applyForce = applyForce();
    this.display = display();
};

var update = function () {
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);

    this.acc.multiply(0);
};

var seek = function(target){
    var desired = Victor.sub(target, this.pos);
    desired.magnitude(this.maxspeed);

    var steer = Victor.sub(desired,this.vel);
    steer.limit(this.maxforce);

    this.applyForce(steer);
};

var applyForce = function(force){
    this.acc.add(force);
};

var display = function(){
    var theta = this.vel.angleDeg() + Math.PI/2;
    //context.beginPath();
    context.fillRect(50, 25, 150, 100);
    context.fillStyle="#3D3C3D";
};

//var update = function(){
//    this.vel.add(this.acc);
//    this.vel.limit(this.topSpeed);
//    this.pos.add(this.vel);
//    this.acc.multiply(0);
//    //if (this.val.b > 0) {
//    //    //console.log('moving right...');
//    //    this.block.x += 5;
//    //}
//    //
//    //////  Tilt right, go right  ////
//    //
//    //else if (this.val.b < 0) {
//    //    //console.log('moving left...');
//    //    this.block.x -= 5;
//    //}
//    //
//    //////  Tilt away from you, go up  ////
//    //
//    //if (this.val.g > 25) {
//    //    //console.log('moving up...');
//    //    this.block.y -= 5;
//    //}
//    //
//    //////  Tilt towards you, go down  ////
//    //
//    //else if (this.val.g < 25) {
//    //    //console.log('moving down...');
//    //    this.block.y += 5;
//    //}
//    //
//    //if (this.block.y <= 0) {
//    //    this.block.y = 0;
//    //}
//    //if ((this.block.x + this.block.w) >= w) {
//    //    this.block.x = w - this.block.w;
//    //}
//    //if (this.block.y <= 0) {
//    //    this.block.y = 0;
//    //}
//    //if ((this.block.y + this.block.h) >= h) {
//    //    this.block.y = h - this.block.h;
//    //}
////}
//};


//var display = function(){
//    var self = this;
//    //console.log('drawing...');
//    context.beginPath();
//
//    //console.log('generating user');
//    context.arc(this.block.x, this.block.y, this.block.w/this.user.size, 0, 2 * Math.PI, false);
//    context.fillStyle="#3D3C3D"; // replace value with user.color;
//    context.fill();
//    context.closePath();
//
//    ////this.loc = {x: block_x, y: block_y};
//    //this.ctx.font = "10px Georgia";
//    //this.ctx.fillText(this.user.name, this.block.x - 10, this.block.y - 10);
//
//};
//var checkEdges = function(){
//
//    if (this.position.x > width) {
//        this.position.x = 0;
//    } else if (this.position.x < 0) {
//        this.position.x = width;
//    }
//
//    if (this.position.y > height) {
//        this.position.y = 0;
//    } else if (this.position.y < 0) {
//        this.position.y = height;
//    }
//};
//var sendData = function(){
//
//    var dat = [{
//        drawValues: this.block,
//        userValues: this.user
//    }];
//    return JSON.stringify(dat);
//};



////////////////////////////////////////////////////

userParticle.prototype.startGame = function(){
    this.requestId = requestAnimationFrame(frame);
};

userParticle.prototype.endGame = function(){
    window.cancelAnimationFrame(requestId);
};

userParticle.prototype.foundIt = function(){
    return !!(this.loc.x < this.treasure.x - 10 + this.treasure.width + 10 && this.loc.x + this.treasure.width + 10 > this.treasure.x - 10 &&
    this.loc.y < this.treasure.y - 10 + this.treasure.height + 10 && this.loc.y + this.treasure.height + 10 > this.treasure.y - 10);
};

window.onkeydown = function (evt) {
    if (!evt) {
        evt = window.event;
    }

    var code = evt.keyCode;

    if (code == 39) {
        rightKey = true;
        //console.log(rightKey);
    }
    else if (code == 37) {
        leftKey = true;
        //console.log('left');
    }
    if (code == 38) {
        upKey = true;
        //console.log('up');
    }
    else if (code == 40) {
        downKey = true;
        //console.log('down');
    }
};

window.onkeyup = function (evt) {

    if (!evt) {
        evt = window.event;
    }

    var code = evt.keyCode;

    if (code == 39) {
        rightKey = false;
        //console.log('rkey up');
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

window.ondeviceorientation = function (evt) {
    if (!evt){
        evt = window.event;
    }
        val.a = evt.alpha;
        val.b = evt.beta;
        val.g = evt.gamma;

    return new Victor(val.b, val.g);
    //return val;
};

function timestamp() {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}


/* Whenever the phone moves it gives me the alpha, beta and gamma value
assuming I'm only using the left/right up/down values, I can limit them
to within 30 points. Then I can get a vector from the values. e.g
(b: -30, g: 20) is the value I get back. My vector angle/ direction would be
to get the angle from the current position to the received vector.

