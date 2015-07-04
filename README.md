# adlib
Another webbased VJing app. It does not look pretty, but it uses a lot of capabilities
of the new-and-shiny WebMidi, WebAudio, WebVideo and WebGL APIs. It is a showcase, if you will.

adlib is a minimal VJing application in the browser, supporting such things
as speed, fading, hue, saturation, rotation, scaling and a few blending effects. It supports
a 2 and a 4 video mode (4 video mode with extra output window, optimized for fullscreen mode).

Also a slightly new feature: we created a new html input element based on the range that
inherits its behaviour from the `range` element.

The midi features were tested with an Behringer CMD MM-1. It should understand all midi
devices, but returning fancy instructions (e.g. if your midi device supports color change
on pressing a button) may fail.

For best performance and experience, please use Google Chrome (we're really sorry).
Namely, the Firefox audio tag does not support speed adjustment natively, which sucks for us.
Also it does not implement the WebMIDI API just yet, which sucks even harder for us.

## Building and Running

We advise you to go to [the website](http://adlib.tobsic.de) to play with the thingie, but
if you want to run a local copy (or the server is down), clone the repo, run `npm install`
and `grunt` (if you want non-minified js) or `grunt prod` (if you want slightly speedier
minified js) and you're good to go. The server should live in `localhost:8001`. Enjoy!

## For tinkerers

the html files can be found in `html`. the only file that might be interesting to you
is the `knob.html` file, where the custom html element is described.

JS code is dived into `src`, where the main code lies that sets everything up, and
`lib`, where effects and widgets can be found (each in their own file).

We refrained from using any framework except from those builtin in the browser
(and grunt for building), so it might seem a bit backwards, but we saw that as a
challenge set for ourselves. We do not apologize for any inconveniences this might
cause for you.
