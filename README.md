# HumanDetector
I wrote this class after being harrased by a constant stream of spam emails from my company website - my fault that I didn't implement a captcha of any form - I finally reached the point of it annoying me enough to do something about it but I couldn't be bothered to go about the hassel of implementing the Google Captcha, so I decided to code my own over a lazy weekend.
  
I should state here that the Google Captcha is going to be way more advanced than anything I could cook up in 2 days worth of just messing around whilst binge watching TV shows, but I wanted something I could just drop and drag into a website with very little hassle, no API keys, just a basic human check that would catch out most attempts.
  
  
## Can I use it?
But of course you may! I've written this library with the intention of allowing anyone else to use it and modify as they see fit, I likely won't be putting much effort into maintaining it so if you find a fault be my guest at resolving and pushing in a fix! :)
  
  
## How to implement?
- First thing, grab a copy of the file and include it in your HTML.
- Next add a new `<div />` element to your HTML, it can have any ID or class name so long as you can identify it from the JS. So lets say add a div like `<div id="captcha" />`. Don't give it any child elements - they will get wiped!
- In your JS script area find your element and pass it into the captcha class initialiser like so...
```
let detectorElement = document.getElementById('detector');
let detector = new HumanDetector(detectorElement);
```
- Finally - when it comes to you submitting your form just run an additional check using the detector to confirm a human has been identified:
```
onSubmit = () => {
    const state = detector.detectionState();
    if (state===1){
        alert("A human has been identified.");
    } else if (state===2) {
        alert("A computer has been identified.");
    } else {
        alert("No conclusion has been made yet");
    }
}
```
  
  
If you'd like a working example check out the SampleWebsite.html file!
  
  
## Config Options
There a few options that I've coded in to allow you to customise the UI, see the following for details...
```

// Config options
const config = {

    // The size of the letters - the entire UI will scale appropriately as 
    // this number is enlarged. It has a min of 30 and max of 60. 
    // Default is 30
    letterSize:40,

    // Debug mode will simply highlight certain elements so you can see
    // how things are scaled, rotated and positioned easier.
    // Default is false
    debugMode:false,

    // Minimum letter rotation is the smallest degree int of rotation allowed
    // 0 is the smallest allowed here and will be randomised on both - and + scales
    // Default is 0
    minLetterRotation:0,

    // Maximum letter rotation is the highest degree int of rotation allowed
    // Must be less than 360 and greater than the minLetterRotation.
    // Default is 15
    maxLetterRotation:15,

    // The length of the captcha phrase. Must be between 4 and 8.
    // Default is 5
    captchaSize:5,

    // The quantity of times a user (or computer) can guess at a code incorrectly before
    // we fall into them being a computer.
    // Default is 8
    allowedFails:8,

    // Displays the letters in a StereoScopic style - this was just for fun :) 
    // Default is false
    stereoscopicMode:false,

    // Embeds a hidden input which is used to help identify bot inputs. 
    // Default is true
    useHoneyPot:true,

}

// Grab element and create detector with our config
let detectorElement = document.getElementById('detector');
let detector = new HumanDetector(detectorElement, config);

```
  
  
## Methods
There are a few available methods that you will use:
```

// Detecting the current state will highlight if a human has been identified
// or if a computer is thought to be in control.
// The available values are:
// 0 = No conclusion has been made - they still have attempts to try
// 1 = A human has been identified
// 2 = Too many fails or the honeypot trap was triggered, looks like a bot.
detector.detectionState();


// Resets the form with a new captcha phrase. This does not undo a honeypot
// trap though - for that to occur the user will need to refresh the page
detector.reset();


// Simply outputs a new Captcha phrase, calling this will not effect the
// Human Detector control itself and you can't plug this phrase back into
// the control...but you might want a Captcha for other means! :)
detector.getNewCaptcha();

```
  
  
## Nerd here; how does it work?
Ah a like-minded individual I see! Welcome! - I was working from the basis of the original Captcha design where each letter was randomised but wanted to make it JS friendly and quick to build, so I went down the road of using a Canvas element to display each character. Whilst I could have used a single canvas element to draw the text I couldn't be bothered to work out the pen movements so I decided to just use multiple canvas elements for each letter - the performance is still decent! I then applied a multitude of limited randomisations on the colour, size, position, opacity and rotation, and we have a good looking captcha!
  
You can use the `debugMode:true` config option in order to get a better understanding of how everything fits together! (Plus it looks kinda cool!). Hope you enjoy looking through the source code and finding better ways to achieve what I've done! ;)
  
  
## Honey Pot
This was a new thing for me to understand but its actually a pretty good idea so I thought I would save some other people (and future me) some trouble and just embed it into the HumanDetector! The basic principal is that bots can't differentiate between which fields it should and shouldn't populate, it also can't physically see which inputs are actually visible on the screen (unless the input is a hidden or display:none type). Using this we can add an additional input into the UI within the form (where this detector will likely sit) and if we find a value sitting in our 'honey pot' input field (which remember; the user cannot see) then we know its most likely a bot.
  
I've baked this into the library but you can turn it off by setting the `useHoneyPot:false` config option. I should note that the reset() function will **NOT** clear the honeypot input - a refresh of the page will manage that though. This is by design to persist the input value.