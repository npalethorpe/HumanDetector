# HumanDetector
I wrote this class after being harrased by a constant stream of spam emails from my company website - my fault that I didn't implement a captcha of any form - I finally reached the point of it annoying me enough to do something about it but I couldn't be bothered to go about the hassel of implementing the Google Captcha, so I decided to code my own over a lazy weekend.
  
I should state here that the Google Captcha is going to be way more advanced than anything I could cook up in 2 days worth of just messing around whilst binge watching TV shows, but I wanted something I could just drop and drag into a website with very little hassle, no API keys, just a basic human check that would catch out most attempts.
  
## Nerd here; how does it work?
Ah a like-minded individual I see! Welcome! - I was working from the basis of the original Captcha design where each letter was randomised but wanted to make it JS friendly and quick to do so I went down the road of using a Canvas element to display each character. Whilst I could have used a single canvas element to draw the text I couldn't be bothered to work out the pen movements so I decided to just use multiple canvas elements for each letter - the performance is still decent! I then applied a multitude of limited randomisations on the colour, size, position, opacity and rotation, and we have a good looking captcha!
  
Hope you enjoy looking through the source code and finding better ways to achieve what I've done! ;)
  
## Can I use it?
But of course you may! I've written this library with the intention of allowing anyone else to use it and modify as they see fit, I likely won't be putting much effort into maintaining it so if you find a fault be my guest at resolving and pushing in a fix! :)
  
## How to implement?
- First thing, grab a copy of the file and include it in your HTML.
- Next add a new `<div />` element to your HTML, it can have any ID or class name so long as you can identify it from the JS. So lets say add a div like `<div id="captcha" />`. Don't give it any child elements - they will get wiped!
- In your JS script area find your element and pass it into the captcha class initialiser like so...
```
let detectorElement = document.getElementById('detector');
let detector = new HumanDetector(detectorElement, {
    letterSize:40,
    debugMode:false,
    minLetterRotation:0,
    maxLetterRotation:20,
    captchaSize:5,
    allowedFails:10,
});
```
  
If you'd like a working example check out the SampleWebsite.html file!
  
And thats all there is to it! I've kept all styling to be automatically applied in the JS to make implementation easier but feel free to jump into the code and modify to suit yourself! I would advise that you leave the margins and sizing alone though as a lot of it is randomised in the code so changing styling properties could very well impact how the UI is displayed! - what I mean is, you may balls it up. Have fun though! :P

