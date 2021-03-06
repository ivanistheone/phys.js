



var TARGET_POS = 600;

function Rect(options) { 

options || (options = {})    // this is madness 
this.width = options.width || 10
this.height = options.height || 10
this.x = options.x || 0
this.y = options.y || 0
this.fill = options.fill || 'rgba(0, 0, 0, 1)'

this.v_x = 0;       // pixels / second
this.v_y = 0;       // pixels / second
this.a_x = 0;       // pixels/second^2
this.a_y = 0;       // pixels/second^2
}



Rect.prototype.move = function (maxWidth, maxHeight) {
// move dat particles based on a_x and a_y
var time, dt;

// get dt since last draw
this._clock = this._clock ? this._clock : new Date().getTime();
time = new Date().getTime();
dt = (time - this._clock)/1000;  // in seconds    
if (dt <= 0.0 ) { return };
this._clock = time ;             // Update the clock


// integrate in x 
this.v_x = this.v_x + this.a_x * dt; 
this.x   = this.x  + this.v_x * dt  +  0.5 * this.a_x * dt * dt;

// same in y    
this.v_y = this.v_y + this.a_y * dt; 
this.y   = this.y  + this.v_y * dt  +  0.5 * this.a_y * dt * dt;

//this.x += 5
if (this.x > maxWidth)  this.x = 0;
if (this.y > maxHeight) this.y = 0;

}


Rect.prototype.render = function (context) {
    if (this.img){
        context.drawImage(this.img,this.x,this.y-50,120,100);
    } else {
        context.fillStyle = this.fill
        context.fillRect(this.x, this.y, this.width, this.height)
    }
}





function Anim(canvas, options) {

this.dashboard = options.dashboard; 

this.canvas = canvas;
this.canvas.height = options.height || this.canvas.height;
this.canvas.width  = options.width || this.canvas.width;
this.context = canvas.getContext('2d')

this.obj = []
this._start = false
this._clock = this._clock ? this._clock : new Date().getTime()

    /*
    this.canvas.addEventListener('click', (function (e) {
      e.preventDefault()
      this.start_animation();
    }).bind(this))
    */
}


Anim.prototype.start_animation = function () {
    this._start = !this._start;
    this._starttime = new Date().getTime()


    //this.obj[0].v_x= Number( this.dashboard.find(".velocity").text() );    
    
    this.start();


}



Anim.prototype.move = function () {

var timenow = new Date().getTime();
this.dashboard.find(".time").text( (timenow - this._starttime)/1000);

this.obj.forEach((function (o) {
  o.move(this.canvas.width, this.canvas.height)
}).bind(this))    


// check for collisions
if (this.isCollision()){
    this._start = false;
    console.log("collided!!");
}

}


Anim.prototype.draw_xy_axes = function () {
var ctx = this.context,
    arr_size = 8;

    // x - axis
    ctx.beginPath();
    var xaxis_pos = this.canvas.height-10;
    ctx.moveTo(0,xaxis_pos);
    ctx.lineTo(this.canvas.width,xaxis_pos);
    ctx.lineTo(this.canvas.width-arr_size,xaxis_pos+ 0.5*arr_size);
    ctx.lineTo(this.canvas.width,xaxis_pos);    
    ctx.lineTo(this.canvas.width-arr_size,xaxis_pos- 0.5*arr_size);
    //ctx.lineTo(this.canvas.width,xaxis_pos);
    //ctx.lineTo(this.canvas.width-arr_size,-arr_size);    
    ctx.stroke();    
    ctx.font = 'Italic 9px Sans-Serif';
    ctx.strokeText("x", this.canvas.width - arr_size - 8, xaxis_pos+ 9);  

    // y - axis
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(0,this.canvas.height);
    //    ctx.lineTo(arr_size, this.canvas.height-arr_size);
    //    ctx.lineTo(0, this.canvas.height);
    //    ctx.lineTo(-arr_size, this.canvas.height-arr_size);    
    ctx.stroke();    
    ctx.font = 'Italic 9px Sans-Serif';
    //    ctx.strokeText("y", 3, this.canvas.height - arr_size - 3);  

}

Anim.prototype.render = function () {
    this.canvas.width = this.canvas.width  // clear
    this.draw_xy_axes()
    this.obj.forEach((function (o) {
      o.render(this.context)
    }).bind(this))

    if (this._start){
        this.dragUI.render();
    }

}



// main loop
Anim.prototype.start = function () {
if (this._start) { 
    // if animation is running...
    requestAnimationFrame((function () {
            this.start()
    }).bind(this))
    this.move()
    this.render()
} else { // don't do anything
    return;    
}
}


// initialize/reset animation 
Anim.prototype.reset = function () {
    // horizontal moving blob with no gravity 
    this.obj = [];
    this.dashboard.find(".time").text( 0 );
    this._start = false;
    
    r1 = new Rect({ x:0, y:100, width:20, height:10 })
    //r1.v_x = Number( this.dashboard.find(".velocity").text() );    
    r1.fill = 'rgba(255, 0, 0, 1)'
    
    r1.img = new Image();
    r1.img.src = "img/spaceship.png";

    this.obj.push(r1);
    
    r2 = new Rect({ x:TARGET_POS, y:50, width:5, height:100 })
    this.obj.push(r2);    
    
    this.render();


}


Anim.prototype.isCollision = function () {
    var rocket = this.obj[0];
    if (rocket.x + 120 >= TARGET_POS) {
        return true;
    } else {
        return false;
    }

}




// click and drag UI
var DragUI = function( anim ) {
    this.anim = anim;
    anim.dragUI = this;
    this.mouse = {x: 0, y: 0, isDown: false};

    // use jQuery $.proxy to bind `this` to the dragUI object inside event handlers 
    $(anim.canvas).on("mousemove", $.proxy(this.render,this)        );
    $(anim.canvas).on("mousedown", $.proxy(this.mouseDown,this)     );
    $(anim.canvas).on("mouseup",   $.proxy(this.mouseUp,this)       );

    console.log("initizlized DragUI");
}



// Draw the slingshot
DragUI.prototype.render = function(e) {
    //console.log("rendering...");
    if (e) {
         this.getMousePosition(e);      // if called with w=== mousemove 
    }                                   // else could be called from Anim 

    var ctx = this.anim.context;
    if (this.mouse.isDown) {
        if (!this.anim._start) {
            this.anim.render(); 
        }
        ctx.beginPath();
        ctx.moveTo(this.anim.obj[0].x, this.anim.obj[0].y);
        ctx.lineTo(this.mouse.x, this.mouse.y);
        ctx.stroke();
        ctx.closePath();
    }
}

DragUI.prototype.getMousePosition = function(e) {
    var anim = this.anim,      // jQuery attached the anim object to the e.data ...
        dragUI = this;
    
    // this function will be bound to the canvas 
    dragUI.mouse.x = e.pageX - anim.canvas.offsetLeft;
    dragUI.mouse.y = e.pageY - anim.canvas.offsetTop;
}


DragUI.prototype.mouseDown = function(e) {
    var anim = this.anim,      // jQuery attached the anim object to the e.data ...
        dragUI = this;
    if (e.which == 1) {
        dragUI.getMousePosition(e);
        dragUI.mouse.isDown = true;
        anim.obj[0].x = dragUI.mouse.x;
        anim.obj[0].y = dragUI.mouse.y;
    }
}

DragUI.prototype.mouseUp = function(e) { 
    var anim = this.anim,      // jQuery attached the anim object to the e.data ...
        dragUI = this,
        ball = anim.obj[0];

    this.getMousePosition(e);
    if (e.which == 1) {
        dragUI.mouse.isDown = false;
        ball.v_y = (dragUI.mouse.y - ball.y) / 2;
        ball.v_x = (dragUI.mouse.x - ball.x) / 2;
    }

    if (!anim._start) {
      anim.start_animation();
    }
}













