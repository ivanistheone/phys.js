// phys.js 
// x-axis is to the right
// y-axis is downward 


// BODY aspect 

var Body = function(options) {
    options || (options = {})    // this is madness 
    this.x = options.x || 0.
    this.y = options.y || 0;
    this.v_x = options.v_x || 0;
    this.v_y = options.v_y || 0;
    this.a_x = options.a_x || 0;
    this.a_y = options.a_y || 0;
}


// Reads off the a_x and a_y values from the body and time evloves the state {x, y, v_x, v_y }
// for a time dt to produce an updated state
Body.prototype.computeMove = function(state, dt) {
    var istate = state,
        fstate = {}; 
    // assume body feels a constatn acceleration during time dt
    // the new x-coordinate and x-velocity are:
    fstate.x   = istate.x   + istate.v_x * dt  +  0.5 * this.a_x * dt * dt;
    fstate.v_x = istate.v_x + this.a_x * dt; 
    // same in y        
    fstate.y   = istate.y   +   istate.v_y * dt  +  0.5 * this.a_y * dt * dt;
    fstate.v_y =                istate.v_y       +        this.a_y * dt; 
    return fstate;
}


// perform the actual move of the body
Body.prototype.move = function(dt) {
    var istate = { x: this.x, y: this.y,  v_y:this.v_x, v_y: this.v_y},
        fstate;
    fstate = this.compute_move(istate, dt);
    this.x = fstate.x;
    this.y = fstate.y;
    this.v_x = fstate.v_x;
    this.v_y = fstate.v_y;
}
    


// SHAPE aspect 
var Shape = function(options){
    options || (options = {})    // this is madness 
    this.boundary = options.boundary || [ { x:0, y:0} ];    // default shape is a point
    Body.apply(this, options);
}

// setup the protorype chain 
//      Shape obj -p-> Body obj -p-> Body.proto -p-> Object  
Shape.prototype = Object.create(Body.prototype);


//  The function will return true if the point (x,y) is inside the shape, 
//  or false if it is not.  If the point is exactly on the edge of the polygon,
//  then the function may return true or false
//  e.g.
//  s = new Shape({boundary:[{x:0,y:0}, {x:1,y:0}, {x:1,y:1}, {x:0,y:1}]}) 
//  s.containsPoint( {x:0.5, y:0.5} )     -->     true
//  s.containsPoint( {x:0.5, y:2.5} )     -->     false
Shape.prototype.containsPoint = function(point) {
    var i,j,
        bdry = this.boundary,
        oddNodes = false;
    
    j=this.boundary.length-1;
    for (var i=0; i<this.boundary.length; i++) {
        if (bdry[i].y<point.y && bdry[j].y>=point.y  ||  bdry[j].y<point.y && bdry[i].y>=point.y) {
            if (bdry[i].x + (point.y-bdry[i].y)/(bdry[j].y-bdry[i].y)*(bdry[j].x-bdry[i].x) < point.x) {
                oddNodes=!oddNodes; 
            }
        }
        j=i; 
    }
    return oddNodes;   
}
// Thx to sample code from http://alienryderflex.com/polygon/


// for two convext shapes to collide, one of the vertices on the boundary
// of one of the shapes must lie inside the other shape
Shape.prototype.collidesWith = function(shape2) {
    var that = this;
    return _.any(shape2.boundary, function(bpt2) {
        var pt2 =  {x:shape2.x + bpt2.x,  y:shape2.y + bpt2.y };
        return that.containsPoint(pt2);
    }) || _.any(that.boundary, function(bpt1) {
        var pt1 =  {x:that.x + bpt1.x,  y:that.y + bpt1.y };
        return shape2.containsPoint(pt1);
    });
}


/*


// move dat particles based on a_x and a_y
var time, dt;

// get dt since last draw
this._clock = this._clock ? this._clock : new Date().getTime();
time = new Date().getTime();
dt = (time - this._clock)/1000;  // in seconds    
if (dt <= 0.0 ) { return };
this._clock = time ;             // Update the clock


}



// in pseudojs
var events = []
var t = 0,                // simulation time
      dt,                    // the size of the next simulation step
      treal = 0,          // real time 
      dtreal;              // dtreal = treal - t      


// simulation loop
// get dt since last draw
this._clock = this._clock ? this._clock : new Date().getTime();
treal = new Date().getTime();
if ( events contains an event ev s.t. ev.time < treal ){
    dt = event.time - t
    move( dt )
    event.run.call()    
} else {
    dt = (time - this._clock)/1000;  // candidate dt in seconds
    dt = treal - t
    move(dt)
}

if (dt <= 0.0 ) { return };
this._clock = time ;             // Update the clock




*/