'use strict';

/*
    Developed by N.Palethorpe on a breezy and somewhat wet weekend in the
    countryside where he lives after not 1 but several beers - on the 3rd
    and 4th of August 2019.

    Feel free to adapt and modify as you see fit. I originally developed
    this as a ES6 class and then realised that I built it to embed in a 
    website that didn't support ES6 so I back-tracked to produce the following.
    Enjoy! :)
*/
function HumanDetector(container, config){
    if (!config){ config={}; }

    this.container = container;
    this.letterSize = Math.min(60, Math.max(30, isNaN(config.letterSize) ? 30 : config.letterSize));
    this.captchaSize = Math.min(8, Math.max(4, isNaN(config.captchaSize) ? 5 : config.captchaSize));
    this.minLetterRotation = Math.max(0, isNaN(config.minLetterRotation) ? 0 : config.minLetterRotation);
    this.maxLetterRotation = isNaN(config.maxLetterRotation) ? 15 : config.maxLetterRotation;
    this.allowedFails = Math.max(1, isNaN(config.allowedFails) ? 8 : config.allowedFails);
    this.debugMode = config.debugMode === true;
    this.stereoscopicMode = config.stereoscopicMode === true;
    this.captchaCode = this.getNewCaptcha();
    this.state = 0; // 0==Not Entered, 1==Human Pass, 2==Computer Fail
    this.failCount = 0;
    this.draw();
}

// Gets a new captcha
HumanDetector.prototype.getNewCaptcha = function(){
    let captcha = "";
    for (let i = 0; i < this.captchaSize; i++) {
        let r = 0;
        while ("abcdefghijklmnpqrstuvwxyzABCDEFGHIJKLMNPQRSTUVWXYZ123456789".indexOf(r) === -1) {
            r = Math.random() * 16 | 0;
            r = r.toString(16).toUpperCase();
        }
        captcha += r;
    }
    return captcha;
}


// Renew the captcha and redraw
HumanDetector.prototype.reset = function (focus){
    this.state = 0; // Reset back to nothing entered
    this.failCount = 0; // Reset the fail count
    this.captchaCode = this.getNewCaptcha();
    this.draw();
    if (focus === true) {
        let f = this.container.getElementsByClassName("entryField");
        !!f && f[0].focus();
    }
}

// Function to check if a valid captcha has been entered yet
HumanDetector.prototype.detectionState = function(){
    return this.state;
}

// Get random number between x & y
HumanDetector.prototype.getRandomNumberBetween = function(min, max, round) {
    let res = Math.random() * (max - min + 1) + min;
    return round === true ? Math.floor(res) : res;
}

// Draw function
HumanDetector.prototype.draw = function() {
    const refreshSVG = "M 15 3 C 12.031398 3 9.3028202 4.0834384 7.2070312 5.875 A 1.0001 1.0001 0 1 0 8.5058594 7.3945312 C 10.25407 5.9000929 12.516602 5 15 5 C 20.19656 5 24.450989 8.9379267 24.951172 14 L 22 14 L 26 20 L 30 14 L 26.949219 14 C 26.437925 7.8516588 21.277839 3 15 3 z M 4 10 L 0 16 L 3.0507812 16 C 3.562075 22.148341 8.7221607 27 15 27 C 17.968602 27 20.69718 25.916562 22.792969 24.125 A 1.0001 1.0001 0 1 0 21.494141 22.605469 C 19.74593 24.099907 17.483398 25 15 25 C 9.80344 25 5.5490109 21.062074 5.0488281 16 L 8 16 L 4 10 z";
    const refreshSVGSize = 30;
    const tickSVG = "M 25 3 C 12.86158 3 3 12.86158 3 25 C 3 37.13842 12.86158 47 25 47 C 37.13842 47 47 37.13842 47 25 C 47 12.86158 37.13842 3 25 3 z M 25 5 C 36.05754 5 45 13.94246 45 25 C 45 36.05754 36.05754 45 25 45 C 13.94246 45 5 36.05754 5 25 C 5 13.94246 13.94246 5 25 5 z M 34.988281 14.988281 A 1.0001 1.0001 0 0 0 34.171875 15.439453 L 23.970703 30.476562 L 16.679688 23.710938 A 1.0001 1.0001 0 1 0 15.320312 25.177734 L 24.316406 33.525391 L 35.828125 16.560547 A 1.0001 1.0001 0 0 0 34.988281 14.988281 z";
    const tickSVGSize = 50;
    const crossSVG = "M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z";
    const crossSVGSize = 50;

    // Remove all inner childs so we're starting from a clean point
    while (this.container.firstChild) {
        this.container.removeChild(this.container.firstChild);
    }

    // Setup the container styling
    this.container.setAttribute("style", `
        position:relative;
        display:inline-block;
        background:rgba(248,248,248,1);
        padding:15px 25px;
        border: ${ this.debugMode ? "1px solid rgba(14,194,14,0.5)" : "1px solid rgba(230,230,230,1)" };
        border-radius:3px;
    `);

    // Create an inner container
    const innerContainer = document.createElement("div");
    innerContainer.id = "innerContainer";
    innerContainer.setAttribute("style", `
        position:relative;
        border: ${ this.debugMode ? "1px solid rgba(14,194,14,0.5)" : "none" };
        display:flex;
        flex-direction:row;
        width:${(this.captchaCode.length+1)*(this.letterSize*.6)+40+((this.letterSize*.7)*this.captchaCode.length)}px;
        height:${this.letterSize*1.3}px;
        overflow:hidden;
    `);
    this.container.appendChild(innerContainer);

    // Add left button container
    const leftContainer = document.createElement("div");
    leftContainer.id = "leftContainer";
    leftContainer.setAttribute("style", `
        background:rgba(250,250,250,0);
        width:40px;
        display:flex;
        align-items: center;
        justify-content: center;
        user-select: none;
        opacity:1;
        transition:100ms ease-in-out;
    `);
    innerContainer.appendChild(leftContainer);

    // Add the left button
    const leftButton = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    leftButton.id = "leftButton";
    leftButton.setAttribute("width", Math.min(24, this.letterSize * .6));
    leftButton.setAttribute("height", Math.min(24, this.letterSize * .6));
    leftButton.setAttribute("viewBox", `0 0 ${this.state===1 ? tickSVGSize : this.state===2 ? crossSVGSize : refreshSVGSize} ${this.state===1 ? tickSVGSize : this.state===2 ? crossSVGSize : refreshSVGSize}`);
    leftButton.setAttribute("style", `
        transition:100ms ease-in-out;
    `);
    leftContainer.appendChild(leftButton);

    const leftButtonPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    leftButtonPath.setAttribute("font-weight", "400");
    leftButtonPath.setAttribute("font-family", "sans-serif");
    leftButtonPath.setAttribute("white-space", "normal");
    leftButtonPath.setAttribute("overflow", "visible");
    leftButtonPath.setAttribute("style", `
        line-height:normal;
        text-indent:0;
        text-align:start;
        text-decoration-line:none;
        text-decoration-style:solid;
        text-decoration-color:#000;
        text-transform:none;
        block-progression:tb;
        isolation:auto;
        mix-blend-mode:normal;
    `);
    leftButtonPath.setAttribute("d", this.state===1 ? tickSVG : this.state===2 ? crossSVG : refreshSVG);
    leftButton.appendChild(leftButtonPath);

    // Add click listener for the left container
    if (this.state===0) {

        // We only want to apply the left button events if we're in the
        // 'undecided' state.
        leftContainer.onmousedown = () => {
            leftButton.style.opacity = "0.3";
        }
        leftContainer.onclick = () => {
            this.reset(true);
        }

    }

    // Add captcha container
    const middleContainer = document.createElement("div");
    middleContainer.id = "middleContainer";
    middleContainer.setAttribute("style", `
        position:relative;
        background:transparent;
        display:flex;
        flex:1;
        text-align:center;
        align-items:center;
        justify-content:flex-start;
        width:${(this.captchaCode.length+1)*(this.letterSize*.6)}px;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
    `);
    innerContainer.appendChild(middleContainer);

    if (this.state!==0) {

        const validPar = document.createElement("p");
        validPar.id = "validpar";
        validPar.innerText = this.state===2 ? "PROBABLY A COMPUTER" : "PROBABLY A HUMAN";
        validPar.setAttribute("style", `
            position:relative;
            text-align:left;
            align-items:flex-start;
            user-select: none;
            -webkit-user-select:none;
            -moz-user-select:none;
            padding:0 0 0 10px;
            margin:0;
            font-size:${ Math.max(12, this.letterSize*.4) }px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
            letter-spacing:${this.letterSize*.04}px;
        `);
        middleContainer.appendChild(validPar);

    } else {

        // Loop through each of the letters
        for (let i = 0; i < this.captchaCode.length; i++) {

            const letterCanvas = document.createElement("canvas");
            const letterRand = Math.random();
            const letterSize = this.letterSize * this.getRandomNumberBetween(1.1, 1.3);
            const letterRotation = Math.random() > .5 ?
                -Math.abs(this.getRandomNumberBetween(this.minLetterRotation, this.maxLetterRotation, true)) :
                +Math.abs(this.getRandomNumberBetween(this.minLetterRotation, this.maxLetterRotation, true));
            const ctx = letterCanvas.getContext("2d");
            letterCanvas.id = "letter" + i;
            letterCanvas.width = this.letterSize * 2;
            letterCanvas.height = this.letterSize * 2;
            letterCanvas.setAttribute("style", `
                position:absolute; 
                top:0;
                margin-top:${(innerContainer.clientHeight-this.letterSize)*.3}px;
                margin-left:${i*(this.letterSize*(letterRand>.5?.50:.54))}px;
                border: ${this.debugMode ? "1px solid rgba(0,0,197,0.4)" : "none"}; 
                transform:rotate(${letterRotation}deg);
                user-select: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                width:${this.letterSize}px;
                height:${this.letterSize}px
            `);
            ctx.font = `${letterRand<.3?"bolder":letterRand>.7?"lighter":"normal"} ${letterSize}px Arial`;
            ctx.textBaseline = "top";
            
            // Calculate the new X and Y positions for this letter
            const letterX = (letterCanvas.width - (letterSize * .6)) / 2;
            const letterY = (letterCanvas.height - letterSize) / 2;
            
            // Check if we have applied the fun Stereoscopic mode
            if (this.stereoscopicMode===true){

                // Sterioscopic mode so add in layered text
                ctx.fillStyle = "rgba(223,80,63,.8)";
                ctx.fillText(this.captchaCode[i], letterX-(letterSize*.07), letterY);
                ctx.fillStyle = "rgba(148,215,226,.8)";
                ctx.fillText(this.captchaCode[i], letterX+(letterSize*.07), letterY);
                ctx.fillStyle = "black"
                ctx.fillText(this.captchaCode[i], letterX, letterY);

            } else {
                
                // Randomly generate slight variations on colour and opacity
                const colourInt = this.getRandomNumberBetween(0, 80, true);
                const colourOpacity = this.getRandomNumberBetween(0.7, 1);
                ctx.fillStyle = `rgba(${colourInt},${colourInt},${colourInt},${colourOpacity})`;
                ctx.fillText(this.captchaCode[i], letterX, letterY);

            }

            ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
            middleContainer.appendChild(letterCanvas);

        }

        // Create the right side container
        const rightContainer = document.createElement("div");
        rightContainer.id = "rightContainer";
        rightContainer.setAttribute("style", `
            width:${(this.letterSize*.7)*this.captchaCode.length}px;
            display:flex;
            align-items: center;
            justify-content: center;
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            opacity:1;
            transition:100ms ease-in-out;
        `);
        innerContainer.appendChild(rightContainer);

        // Add in the input field for code entry
        const entryField = document.createElement("input");
        entryField.classList.add("entryField");
        entryField.type = "text";
        entryField.setAttribute("placeholder", "");
        entryField.setAttribute("maxlength", this.captchaCode.length);
        entryField.setAttribute("style", `
            background:rgba(255,255,255,1);
            border:1px solid rgba(180, 180, 180, 1);
            border-radius:3px;
            color:rgba(20,20,20,1);
            width:100%;
            transition:100ms ease-in-out;
            padding:5px 10px;
            margin:0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
            font-size:${ Math.max(12, this.letterSize*.5) }px;
            letter-spacing:${this.letterSize*.06}px;
            text-align:center;
            outline:none;
        `);
        entryField.oninput = (e) => {
            const enteredVal = e.target.value;
            if (enteredVal.length === this.captchaCode.length) {
                if (enteredVal === this.captchaCode) {

                    // Valid code entered
                    this.state = 1;
                    this.draw();

                } else {

                    // Increase our fail counter
                    this.failCount++;

                    // Check our fail count
                    if (this.failCount>=this.allowedFails){

                        // Change the state and redraw
                        this.state = 2;
                        this.draw();

                    } else {
                        
                        // Renew the code and redraw
                        this.captchaCode = this.getNewCaptcha();
                        this.draw();
                        let f = this.container.getElementsByClassName("entryField");
                        !!f && f[0].focus();
                        
                    }

                }
            }
        }
        rightContainer.appendChild(entryField);

    }

}