


var TARGET_POS = 700;

;(function () {

  function Rect(options) {
  
    options || (options = {})
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
    context.fillStyle = this.fill
    context.fillRect(this.x, this.y, this.width, this.height)
  }
  
  
  
  
  
  
  

  function Anim(canvas, options) {
    this.canvas = canvas
    this.canvas.height = options.height || this.canvas.height;
    this.canvas.width  = options.width || this.canvas.width;
    this.context = canvas.getContext('2d')
    this.obj = []
    this._start = false
    this._clock = this._clock ? this._clock : new Date().getTime()

    this.canvas.addEventListener('click', (function (e) {
      e.preventDefault()
      this.start_animaltion();
    }).bind(this))
  }


  Anim.prototype.start_animation = function () {
    this._start = !this._start;
    this.start();
  }
  
  

  Anim.prototype.move = function () {
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
    
    r1 = new Rect({ x:0, y:100, width:20, height:10 })
    r1.v_x = 300;    
    r1.fill = 'rgba(255, 0, 0, 1)'
    this.obj.push(r1);
    
    
    // draw target
    r2 = new Rect({ x:TARGET_POS, y:50, width:5, height:100 })
    this.obj.push(r2);    
    
    this.render();
    
  }
  

  Anim.prototype.isCollision = function () {
    var rocket = this.obj[0];
    
    if (rocket.x + rocket.width >= TARGET_POS) {
        return true;
    } else {
        return false;
    }
    
  }





  ;(function init() {
    var r1,r2,r3,r4;

    c = new Anim(document.getElementById('demo1'), {height:200, width:800})
    
    window.anim = c;        // save for posterity

    c.reset();
    
    
    c.render()
  }())
    
}())