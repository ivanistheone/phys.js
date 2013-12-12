/*  File: simple.java
    A simple version of a physics simulation
    This is a text-only version of the simple spring simulation.

    Part of the www.MyPhysicsLab.com physics simulation applet.
    Copyright (c) 2001  Erik Neumann

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA

    Contact Erik Neumann at erikn@MyPhysicsLab.com or
    610 N. 65th St. Seattle WA 98103

*/

/*
  Instructions for use:
  NOTE:  I recommend you delete all *.class files before beginning
  to be sure you are not using any old classes.

  --------  AS STANDALONE JAVA APP  ---------------
  in your command line (eg. DOS prompt in Windows):
  1. compile with the command
    javac simple.java -target 1.1
  2. run with the command
    java simple
  This will start the app, you can click "stop" and "start" to pause.

  --------  AS APPLET IN WEB BROWSER -------------
  1.  compile with:
    javac simple.java -target 1.1
  2.  open a web page that displays the applet... here is some sample html code:
    <html>
    <head>
    <title> Simple Simulation </title>
    </head>
    <body>
    <h3> Simple Simulation </h3>
    <applet code="simple.class" width=600 height=480>
    </applet>
    </body>
    </html>

  -------- TO DEBUG WITH PRINT STATEMENTS --------
  Put statments into your code such as:
    System.out.println("value = "+value);
  where 'value' is a variable you want to see.
  Note that if running in a browser you must 'show console' to see
  the print statements.

  --------  TO DEBUG WITH JDB  -----------------
  1. compile with the debug option:
    javac -g simple.java
  2. start running with the jdb debugger
    jdb simple
  3. set a breakpoint by:
    stop at class:line
    where 'class' is replaced by a class and 'line' by a line number
    here's an example:
    stop at simple:138
  4. type:
    run
    the window for the app will open and start running.
    the debugger will stop execution at the line you specified.
  5. use the jdb commands such as: stop at, step, next, cont, print, where, locals
    type:
    help
    to see a list of available commands
    (type these into your DOS prompt window, not into the application!)

*/

import java.awt.*;
import java.awt.event.*;
import java.applet.*;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.net.URL;
import java.util.Enumeration;
import java.io.*;
import java.util.Iterator;


/*
  Single spring & single mass, in one dimension (moving horizontally)

  vars[0] = position (x) with origin as above
  vars[1] = velocity (v=x')
  R = rest length
  len = current length of spring = x - origin.x
  L = how much spring is stretched from rest length
  L = len - R = x - origin.x - R
  k = spring constant
  b = damping constant
  F = m a  (force = mass * acceleration) leads to:
  F = -kL -bv = -k(x - origin.x - R) -bv = m v'
  so diffeq's are:
  x' = v
  v' = -(k/m)(x - origin.x - R) -(b/m)v
*/

class S_Spring
{
  double m_SpringConst = 3;
  double m_RestLength = 2.5;
  double m_X1 = 0;  // left end of spring
}

class S_Mass
{
  double m_Mass = 0.5;
  double m_Damping = 0.2;
}

public class simple extends Applet implements ActionListener {

  S_Spring m_Spring;
  S_Mass m_Mass;
  public int        numVars = 2;    // number of variables in vars[]

  public static final int MAX_VARS = 40;
  private S_LabTimer timer = null;
  TextArea textarea1;
  Button button_stop;
  Button button_start;
  double m_time = -9999;
  double sim_time = 0;
  boolean m_Animating = true;
  public double[]    vars;  // array of variables

  public void outputObjects()  // report state of objects
  {
    DecimalFormat df = new DecimalFormat(" 0.0000;-0.0000");
    String msg = "t = "+df.format(sim_time)+
        "   x = "+df.format(vars[0])+
        "   v = "+df.format(vars[1])+"\n";
    textarea1.append(msg);
  }

  /* Explanation of how to code up differential equations:
    The variables are stored in the vars[] array.
    Let y = var[0], w = var[1], z = var[2], etc.
    The differential equations must all be first order, in the form:
      y' = f(t, y, w, z, ...)
      w' = g(t, y, w, z, ...)
      z' = h(t, y, w, z, ...)
      ...
    You will have as many equations as there are variables

    diffeq0 returns the right hand side of the first equation
      y' = f(t, y, w, z, ...)
    diffeq1 returns the right hand side of the second equation
      w' = g(t, y, w, z, ...)
  */

  public double diffeq0(double t, double[] x)   // t = time, x = array of variables
  {
    return x[1];  // x' = v
  }

  public double diffeq1(double t, double[] x)   // t = time, x = array of variables
  {
    // v' = -(k/m)(x - R) - (b/m) v
    double r = -m_Spring.m_SpringConst*(x[0] - m_Spring.m_X1 - m_Spring.m_RestLength)
        - m_Mass.m_Damping*x[1];
    return r/m_Mass.m_Mass;
  }

  public double diffeq2(double t, double[] x)
  { return 0; }
  public double diffeq3(double t, double[] x)
  { return 0; }
  public double diffeq4(double t, double[] x)
  { return 0; }
  public double diffeq5(double t, double[] x)
  { return 0; }
  public double diffeq6(double t, double[] x)
  { return 0; }
  public double diffeq7(double t, double[] x)
  { return 0; }

  // executes the i-th diffeq
  // i = which diffeq,  t=time,  x= array of variables
  public double evaluate(int i, double t, double[] x)
  {
    switch (i)
    { case 0:  return diffeq0(t, x);
      case 1:  return diffeq1(t, x);
      case 2:  return diffeq2(t, x);
      case 3:  return diffeq3(t, x);
      case 4:  return diffeq4(t, x);
      case 5:  return diffeq5(t, x);
      case 6:  return diffeq6(t, x);
      case 7:  return diffeq7(t, x);
      default:
        System.out.println("throw?  problem in evaluate");
        return 0;
    }
  }

  // A version of Runge-Kutta method using arrays
  // Calculates the values of the variables at time t+h
  // t = last time value
  // h = time increment
  // vars = array of variables
  // N = number of variables in x array
  public void solve(double t, double h)
  {
    int N = numVars;
    int i;
    double[] inp = new double[N];
    double[] k1 = new double[N];
    double[] k2 = new double[N];
    double[] k3 = new double[N];
    double[] k4 = new double[N];
    for (i=0; i<N; i++)
      k1[i] = evaluate(i,t,vars);     // evaluate at time t
    for (i=0; i<N; i++)
      inp[i] = vars[i]+k1[i]*h/2; // set up input to diffeqs
    for (i=0; i<N; i++)
      k2[i] = evaluate(i,t+h/2,inp);  // evaluate at time t+h/2
    for (i=0; i<N; i++)
      inp[i] = vars[i]+k2[i]*h/2; // set up input to diffeqs
    for (i=0; i<N; i++)
      k3[i] = evaluate(i,t+h/2,inp);  // evaluate at time t+h/2
    for (i=0; i<N; i++)
      inp[i] = vars[i]+k3[i]*h; // set up input to diffeqs
    for (i=0; i<N; i++)
      k4[i] = evaluate(i,t+h,inp);    // evaluate at time t+h
    for (i=0; i<N; i++)
      vars[i] = vars[i]+(k1[i]+2*k2[i]+2*k3[i]+k4[i])*h/6;
  }


  public void modifyObjects()
  {
    if (m_Animating)
    {
      outputObjects();

      double now = (double)System.currentTimeMillis()/1000;
      /* figure out how much time has passed since last simulation step */
      /* m_time is used to figure how much real-time has passed since last simulation step */
      /* sim_time is a cumulative time counter in "simulation" time */
      double h;
      if (m_time < 0)
      {
        sim_time = 0;
        h = 0.05;   // assume that a small time has passed at start
      }
      else
      {
        h = now - m_time;
        if (h == 0)
        {
          return;  // does this ever happen?
        }
        // Deal with long delays here... This causes time slippage & animation will stutter
        // It will look like the animation "paused" during the delay, but I think its
        // better than having the animation do a huge discontinuous jump.
        if (h > 0.25)
          h = 0.25;
      }
      if ((h<0) || (h>3))
      {
        System.out.println("*** trouble with time step h = "+h+" ***");
        h = 0.1;  // pick a more reasonable number
      }
      // record time of this simulation step
      m_time = now;

      solve(sim_time, h);
      sim_time += h;

    }
  }


  public void init()
  {
    m_Spring = new S_Spring();
    m_Mass = new S_Mass();
    vars = new double[simple.MAX_VARS];

    textarea1 = new TextArea("", 30, 60);
    add(textarea1);
    button_stop = new Button("stop");
    add(button_stop);
    button_stop.addActionListener(this);
    button_start = new Button("start");
    add(button_start);
    button_start.addActionListener(this);
  }

  public void actionPerformed (ActionEvent e)
  {
    if(e.getSource() == button_stop)
    {
      m_Animating = false;
    }
    else if (e.getSource() == button_start)
    {
      m_Animating = true;
    }
  }

  // called when user returns to browser page containing applet
  public void start()
  {
    if (timer == null)
    {
      timer = new S_LabTimer(this);
      timer.start();
    }
  }

  // called when user leaves browser page containing applet
  public void stop()
  {
    if (timer != null)
    { timer.interrupt();
      timer = null;  // destroys the thread
    }
  }

  public static void main(String[] args)
  {
    Frame frame = new S_AppletFrame();
        frame.show();
  }
}

/////////////////////////////////////////////////////////////////////////////
class S_LabTimer extends Thread
{
private simple myApplet;
private long delay = 33;

  S_LabTimer(simple myApp)
  {
    super("S_LabTimer Thread");
    myApplet = myApp;
  }

  public void run()
  { try
    { while (!interrupted()) // loop until interrupted
      {
        myApplet.modifyObjects();
        sleep(delay);  // milliseconds
      }
    }
    catch(InterruptedException e)
    { System.out.println("S_LabTimer thread interrupted.");
    }
  }

}



/////////////////////////////////////////////////////////////////////////////
class S_LabWindowAdapter extends WindowAdapter
{
  simple myLab = null;
  public S_LabWindowAdapter(simple thisLab)
  {
    myLab = thisLab;
  }

  public void windowIconified(WindowEvent e)
  {
    System.out.println("windowIconified()");
    myLab.stop();
  }

  public void windowDeiconified(WindowEvent e)
  {
    System.out.println("windowDeiconified()");
    myLab.start();
  }

  public void windowDeactivated(WindowEvent e)
  {
    System.out.println("windowDeactivated()");
    //myLab.stop();  // disable this line when using jdb
  }

  public void windowActivated(WindowEvent e)
  {
    System.out.println("windowActivated()");
    myLab.start();
  }

  public void windowClosing(WindowEvent e)
  {
    myLab.stop();
    System.exit(0);
  }
}


/////////////////////////////////////////////////////////////////////////////
class S_AppletFrame extends Frame
   implements AppletStub, AppletContext
{
  public S_AppletFrame()  // constructor
   {
    setTitle("Simple Simulation");
    Toolkit tk = Toolkit.getDefaultToolkit();
    Dimension d = tk.getScreenSize();
    setSize(640, 480);
    setLocation(d.width/10, d.height/10);
    simple applet = new simple();
        applet.setStub(this);
    addWindowListener(new S_LabWindowAdapter(applet));
    add(applet);
    applet.init();
    applet.start();
    //addComponentListener(applet);  // applet listens for resize events
   }


   // AppletStub methods
   public boolean isActive() { return true; }
   public URL getDocumentBase() { return null; }
   public URL getCodeBase() { return null; }
   public String getParameter(String name) { return ""; }
   public AppletContext getAppletContext() { return this; }
   public void appletResize(int width, int height) {}

   // AppletContext methods
   public AudioClip getAudioClip(URL url) { return null; }
   public Image getImage(URL url) { return null; }
   public Applet getApplet(String name) { return null; }
   public Enumeration getApplets() { return null; }
   public void showDocument(URL url) {}
   public void showDocument(URL url, String target) {}
   public void showStatus(String status) {}
  // setStream, getStream, getStreamKeys are for Java 1.4 compatibility
  // comment out these methods to compile with Java 1.3
  public void setStream(String key,
            InputStream stream)
      throws IOException
      {}
  public InputStream getStream(String key) { return null; }
  public Iterator getStreamKeys() { return null; }

}
