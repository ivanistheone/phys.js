phys.js
=======

A physics simulation engine for educational purposes.


Exercise 1: Kinematics
======================
We will study the kinematics of uniform velocity motion x(t)=x_i + v*t and uniform acceleration motion x(t) = x_i + v_i*t + 0.5*a*t*t.
That's it. We're studying two simple equations! The function x(t) describes the position of an object.
If you know the acceleration a, the initial velocity v_i, and the initial position of an object,
then substituting these values into the equation for x(t), you will obtain an equation that allows you
to predict the position of an object at all later times.




Many layers
===========

Kids can enjoy this exercise for its esthetics --- blink blink pixels pixesl explosion. (TODO: add special effects to make it look like a game...)

High school student might look beyound the animation (expandable explanations panels before and after each animation) and learn a thing or two
about the equations of kinematics. We could reward them by asking them to predict the future --- that is to use the equation, plug values in and
compute some number, e.g., a ball is thown vertically in the air at v_i=10m/s, how long before it comes back to the ground?

But why do we need to go to always go to numbers?
Kinematics is about the equation of motion x(t) so we could accept symbolic answers as well[1].

And since all the physics simulaiton is in `JavaScript` why not have `JavaScript` answers as well? 
Readers interested in learning how to code can follow the tutorial at an even deeper level by writing
`JavaScript` functions as answers.
Instead of simply *knowing* the equation for x(t), we can describe x(t) as a procedure:
`x(t) = function(t,  a,v_i,x_i){ return x_i + integrate( function(t2){return v_i + a*t2}, t2, 0, t)  }`.
This is the standard calculus *procedure* for computing the position x(t) given the value of the acceleration function a(t) = a,
the initial velocity v_i and the intitial position x_i.

At a further level, the simluator is a lesson in itself, so someone who feels comfortable with code 
(or is willing to learn) can have a shortcut pass to understanding physics by studying the simulator's source code.


References
----------
[1] https://github.com/Khan/perseus/blob/master/src/expressiontools/compare.js



History
=======
Jun 2012: Arlo Brault figured out how to use window.requestAnimationFrame to scedule the main loop of a canvas animation.

Aug 2013: Sonia Brahmi, Luis Custodio, Jerome Chateauvert, and Ivan Savov worked on producing an exercise at `#HackMTL` to illustrate the possibilities.


TODO
====

rewrite main loop simplify code
decouple animation t (treal) from simulation t
implement events (for collisions / answer checking )

MovableObject
ShapedObject 
implement constraints and collision detection





