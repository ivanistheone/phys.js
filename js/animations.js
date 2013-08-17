
var t = 0;
var lastFrame = Date.now();
setInterval(function() {
    var ball = document.querySelector('.ball');
    var now = Date.now(), dt = (now - lastFrame) / 1000 * 40;
    t += dt; lastFrame = now;
    ball.style.left = 100 + 50 * Math.sin(t * 0.2) + 'px';
    ball.style.top = 100 + 50 * Math.sin(t * 0.2 + 0.4 * Math.PI*2) + 'px';
}, 1000/60);
