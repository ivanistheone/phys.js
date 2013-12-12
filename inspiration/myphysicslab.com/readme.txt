This is the Readme file for MyPhysicsLab java applets.  
There are currently three applets available:
  Lab -- contains most of the MyPhysicsLab simulations
  LabTest -- a smaller version of Lab that runs only a single simulation, no graph or controls.
  simple -- a simplified text-only version for students

==========================
License
==========================
The MyPhysicsLab source code is provided under the GNU General Public License,
see the attached file 'copying.txt'.

The author is Erik Neumann.  Contact me at erikn@MyPhysicsLab.com.
The website where this code is available is http://www.MyPhysicsLab.com

===========================
Tools Needed
===========================
To compile the Lab source code, obtain the Java 2 SDK (software development kit)
from http://java.sun.com/ and install it.  The Java 2 SDK version 1.4 or later is required.

Ant is the build tool used here.  Obtain ant from http://ant.apache.org/.

Information about Java tools such as javac, jdb, and java are at
http://java.sun.com/j2se/1.4.2/docs/tooldocs/tools.html


===========================
Compiling Lab.java
===========================
See the file 'build.xml' which contains the instructions for ant about how to build 
and run the Lab application.  It also contains documentation comments about how to install 
and build these source files.

NOTE:  the directory structure on my website is currently set up as:
source/code/comm/myphysicslab/simlab
The "comm" directory should be renamed to "com" before trying to compile.
(Why?  The FTP software provided by my website host does not allow directories named "com"!)

==========================
Compiling simple.java
==========================
This is a simplified text-only version of a spring simulation.
Instructions for compiling are included as comments at the start
of the file 'simple.java'.


===========================
Hints on Debugging
===========================
Put statments into your code such as:
    System.out.println("value = "+value);
where 'value' is a variable you want to see.
Note that if running in a browser you must 'show console' to see
the print statements.

===========================
Debugging with jdb
===========================
JDB is the java debugger supplied by Sun.  It allows you to set breakpoints and
examine variables while running the application.  Here are the steps to use jdb:
1. compile with the debug option:
    javac -g simple.java
2. start running with the jdb debugger
    jdb simple
3. set a breakpoint by:
    stop at class:line
    where 'class' is replaced by a class and 'line' by a line number
    here's an example:
    stop at Lab:138
4. type:
    run
    the window for the app will open and start running.
    the debugger will stop execution at the line you specified.
5. use the jdb commands such as: stop at, step, next, cont, print, where, locals
    type:
    help
    to see a list of available commands
    (type these into your DOS prompt window, not into the application!)

==========================
Other files
==========================
The other files included with this distribution are:
copying.txt  --  a copy of the GNU General Public License
readme.txt  --   the file you are reading
MANIFEST.MF  -- for creating .jar files
test_applet.html  -- for testing the applet
