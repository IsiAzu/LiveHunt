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
    userclass = new userParticle(itemToFindLoc, userInfo,  "socketID", val);


    var render = function () {
        userclass.run();
        var data = userclass.sendData();
        console.log(data);

        requestAnimationFrame(render);
        //console.log("hi");
        //console.log(val);

    };
    requestAnimationFrame(render);
}

var userParticle = function(tre, user, socID, v){
    this.treasure = tre;
    this.val = v;
    console.log(v);
    this.block = {
        x: w / 2 - 15,
        y: h /2 - 15,
        h: 10,
        w: 10
    };

    this.user = {
        name: null,
        color: null,
        size: 2
    };

    this.notFoundIt = true;
    this.score = 0;
    this.requestId = null;
    this.socketId = socID;
    this.last = timestamp();


    this.run = run;
    console.log(v);
    //this.frames = frames;
    this.update = update;
    this.display = display;
    this.sendData = sendData;

    this.self = this;

};


//  json stringify
var run = function(){
    //console.log("i'm running");
    this.display();
    this.update();
    //requestAnimationFrame(this.frames.bind(this));
};

var update = function(){
    //console.log("trying to update");
    ////  ASSUMING LANDSCAPE, HOME BUTTON ON LEFT  ////
    ////  Tilt left, go left  ////
//if ( this.val.b > 0 || this.val.g > 0) {
//    console.log("moving");
    if (this.val.b > 0) {
        //console.log('moving right...');
        this.block.x += 5;
    }

    ////  Tilt right, go right  ////

    else if (this.val.b < 0) {
        //console.log('moving left...');
        this.block.x -= 5;
    }

    ////  Tilt away from you, go up  ////

    if (this.val.g > 25) {
        //console.log('moving up...');
        this.block.y -= 5;
    }

    ////  Tilt towards you, go down  ////

    else if (this.val.g < 25) {
        //console.log('moving down...');
        this.block.y += 5;
    }

    if (this.block.y <= 0) {
        this.block.y = 0;
    }
    if ((this.block.x + this.block.w) >= w) {
        this.block.x = w - this.block.w;
    }
    if (this.block.y <= 0) {
        this.block.y = 0;
    }
    if ((this.block.y + this.block.h) >= h) {
        this.block.y = h - this.block.h;
    }
//}
};

var display = function(){
    var self = this;
    //console.log('drawing...');
    context.beginPath();

    //console.log('generating user');
    context.arc(this.block.x, this.block.y, this.block.w/this.user.size, 0, 2 * Math.PI, false);
    context.fillStyle="#3D3C3D"; // replace value with user.color;
    context.fill();
    context.closePath();

    ////this.loc = {x: block_x, y: block_y};
    //this.ctx.font = "10px Georgia";
    //this.ctx.fillText(this.user.name, this.block.x - 10, this.block.y - 10);

};

var sendData = function(){

    var dat = [{
        drawValues: this.block,
        userValues: this.user
    }];
    return JSON.stringify(dat);
};



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

    //return val;
};

function timestamp() {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}



