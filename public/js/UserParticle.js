/**
 * Created by Isi on 11/16/14.
 */

var myId, w, h;
var canvas, two, rotate = false;
var userclass, newData;
var val = {
    x: 0,
    y: 0
};
//var mousePos = {
//    x: 0,
//    y: 0
//};

////////////////////////////////////////////////////////////////////////////////
///////////////////////////     SOCKET SECTION   ///////////////////////////////
////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////
///////////////////////     CANVAS DRAWING SECTION   ///////////////////////////
////////////////////////////////////////////////////////////////////////////////

requestAnimationFrame =  window.requestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.msRequestAnimationFrame ||
window.mozRequestAnimationFrame;

function init() {

    canvas = document.getElementById('canvas');
    two = new Two({fullscreen: true}).appendTo(document.body);
    w = two.width;
    h = two.height;
    myId = Math.random();

    // Values for map
    var accelHigh = { // Highest accelerometer val for map
        x: 30,
        y: 20
    }, accelLow = { // Lowest accelerometer val for map
        x: -30,
        y: -20
    }, pageHigh = { // Highest screen val for map
        x: w-5,
        y: h-5
    }, pageLow = { // Lowest screen val for map
        x: 5,
        y: 5
    };

    //var itemToFindLoc = {x: 233, y: 222};

    userclass = new UserParticle(w/2, h/2);

    var target;
    var render = function () {
        //canvas.width = window.innerWidth - 16;

        target = vec2.create();

        // Limit accelerometer x values to (-30, 30) & y values (-20, 20) range
        if(val.x > 30){
            val.x = 30
        } else if(val.x < -30){
            val.x = -30;
        }

        if(val.y > 20){
            val.y = 20
        } else if(val.y < -20){
            val.y = -20
        }

        // Map values
        var mappedVal = pamVector(val, accelHigh, accelLow, pageHigh, pageLow);

        // Set mapped values into target vector
        vec2.set(target, mappedVal.x, mappedVal.y);

        //var m = vec2.create();
        //vec2.set(m, mousePos.x, mousePos.y);
        //mouse.innerHTML = 'Mouse: ' + vec2.str(m);
        //console.log('mouse: ' + vec2.str(m));

        userclass.seek(target);
        userclass.update();
        userclass.display();
        newData = userclass.emitData();

        requestAnimationFrame(render);
    };
    render();
}


function UserParticle(x,y) {
    var accVec, steerVec, desiredVec, theta;

    accVec = vec2.create();
    steerVec = vec2.create();
    desiredVec = vec2.create();

    //uRect = two.makeRectangle(0, 0, 18, 8);

    this.acc = vec2.create(0, 0);
    this.vel = vec2.fromValues(0, 0);
    this.pos = vec2.fromValues(x, y);


    this.r = 6;
    this.maxspeed = 4;
    this.maxforce = 0.3;
    this.rect = two.makeRectangle(0, 0, 20, 10);

    this.update = function () {
        // Update the rendering of our two scene
        two.update();

        vec2.add(this.vel, this.vel, this.acc);

        limit(this.vel, this.vel, this.maxspeed);

        vec2.add(this.pos, this.pos, this.vel);

        vec2.set(accVec, 0, 0);

        this.acc = accVec;

        if(emit){

        }

    };

    this.seek = function (target) {

        vec2.subtract(desiredVec, target, this.pos);
        var d = vec2.length(desiredVec);

        // Scale with arbitrary damping within 100px
        if (d < 100) {
            var m = pam(d, 0, 200, 0, this.maxspeed);
            vec2.normalize(desiredVec, desiredVec);
            vec2.scale(desiredVec, desiredVec, m);
        } else {
            vec2.normalize(desiredVec, desiredVec);
            vec2.scale(desiredVec, desiredVec, this.maxspeed);
        }

        // Set the Magnitude of desired vector (desiredVec)
        vec2.subtract(steerVec, desiredVec, this.vel);

        // Limit the steer vector to maximum force given
        limit(steerVec, steerVec, this.maxforce);

        // Finally apply the steer vector (steerVec) to your object
        this.applyForce(steerVec);
    };

    this.applyForce = function (force) {
        // Add the given vector from seek (steerVec) to acceleration
        vec2.add(this.acc, this.acc, force);
    };

    this.display = function () {
        // Get value of rotation ( in radians );
        theta = Math.atan2(this.vel[1], this.vel[0]);
        //console.log(theta);


        //draw a rectangle inside canvas

        this.rect.fill = 'orange';
        this.rect.noStroke();
        //this.rect.rotation(1);
        this.rect.translation.set(this.pos[0], this.pos[1]);

        // Check if device is moving
        if (rotate == true){
            // On Device movement, rotate my object ( by radians NOT degree ).
            this.rect.rotation = theta;
        }
    };

    this.displayOthers = function(PosXval, PosYval, r, theta, color, uRect) {
        uRect.fill = color;
        uRect.noStroke();
        uRect.translation.set(PosXval, PosYval);

        // check if rotate boolean is true. If true, replace rotation value with theta construct
        if (r == true){
            uRect.rotation = theta;
        }
    };

    this.emitData = function () {
        // I need to emit my x & y values, boolean rotation, theta for rotation,
        // boolean for finding treasure
        var d = {
            x: this.pos[0],
            y: this.pos[1],
            r: rotate,
            t: theta,
            c: "red"
        };
        console.log ("User Info: " + d.toString());
        return JSON.stringify(d);
    }
}

// Additional function to extend glMatrix.
// This function limits a vec2 (v) to float (high).
limit = function (out, v, high) {
    var x = v[0],
        y = v[1];

    var len = x*x + y*y;

    if (len > high*high && len > 0) {
        out[0] = x;
        out[1] = y;
        vec2.normalize(out, out);
        vec2.scale(out, out, high);
    }
    return out;
};

// Map function edited to return a vector (x, y).
pamVector = function (n, start1, stop1, start2, stop2) {
    return {
        x: (n.x - start1.x) / (stop1.x - start1.x) * (stop2.x - start2.x) + start2.x,
        y: (n.y - start1.y) / (stop1.y - start1.y) * (stop2.y - start2.y) + start2.y
    }
};

// Original map function. Gotten from p5.js library. Returns float
pam = function (n, start1, stop1, start2, stop2) {
    return (n - start1) / (stop1 - start1) * (stop2 - start2) + start2
};



/*
 Whenever the phone moves it gives me the alpha, beta and gamma value
 assuming I'm only using the left/right up/down values, I can limit them
 to within 30 points. Then I can get a vector from the values. e.g
 (b: -30, g: 20) is the value I get back. I'll map the values to the width
 and height of the screen. My vector angle/ direction would be to get the
 angle from the current position to the received ( and mapped ) vector.
 */

