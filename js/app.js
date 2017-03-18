/* jshint esversion:6 */
/* globals jQuery, setTimeout, clearTimeout */

(function ($) {
    
    'use strict';
    
    /* =============================== setup =============================== */
    var breakLength = 5,
        sessionLength = 25,
        minutes = sessionLength,
        seconds = 0,
        timerIsRunning = false,
        sessionState = 'Session',
        timeoutState,
        DOM = {};   // cached DOM elements
        

    /* ========================== private methods ========================== */
    
    // cache DOM elements
    function cacheDom() {
        
        DOM.$controls      = $('.controls');

        DOM.$breakLength   = DOM.$controls.find('#break-length');
        DOM.$sessionLength = DOM.$controls.find('#session-length');
        
        DOM.$timer         = $('#timer');
        DOM.$minutes       = DOM.$timer.find('#minutes');
        DOM.$seconds       = DOM.$timer.find('#seconds');
        
        DOM.$sessionLabel  = DOM.$timer.find('#session');
        DOM.$Reset         = DOM.$timer.find('#reset');
    }

    
    // bind events
    function bindEvents() {
        DOM.$controls.on('click', adjustControls);
        DOM.$timer.on('click', handleTimerClick);
    }
    
    
    // controls event handler
    function adjustControls(e) {
        
        if (e.target.id === 'break-minus') {
            breakLength = lengthAdjust(breakLength, -1);
        } else if (e.target.id === 'break-plus') {
            breakLength = lengthAdjust(breakLength, 1);
        } else if (e.target.id === 'session-minus') {
            sessionLength = lengthAdjust(sessionLength, -1);
        } else if (e.target.id === 'session-plus') {
            sessionLength = lengthAdjust(sessionLength, 1);
        }
        
        e.stopPropagation();
        renderControls();
    }
    
    
    // session event handler
    function handleTimerClick(e) {
        
        if (e.target.id === 'reset') {
            
            reset();
            
        } else {
            
            if (!timerIsRunning) {
                countDown();
            } else {
                clearTimeout(timeoutState);
            }
            
            timerIsRunning = !timerIsRunning;
        }
        
        e.stopPropagation();
    }
    
    
    /* increment or decrement specified control's length,
     * never less than zero
     *
     * @param    [number]   time    [positive or negative 1]
     * @param    [number]   value   [current value of the control]
     * @returns  [number]           [incremented / decremented value]
    */
    function lengthAdjust(time, value) {
        return (value === 1) ? time += value : (time > 0) ? time += value : 0;
    }
    
    
    /* zero pad single-digit minutes & seconds
     *
     * @param    [number]   time   [time]
     * @returns  [string]          [time with leading 0 if needed]
    */
    function zeroPad(time) {
        return ('0' + time).substr(-2);
    }
    
    
    // countDown
    function countDown() {
        render();
        
        if (minutes === 0 && seconds === 0) {
            if (sessionState === 'Session') {
                sessionState = 'Break';
                minutes = breakLength;
            } else {
                sessionState = 'Session';
                minutes = sessionLength;
            }
            
            playSound();
            
        } else if (seconds <= 0 && minutes >= 0) {
            seconds = 59;
            minutes -= 1;
        } else if (seconds > 0) {
            seconds -= 1;
        }
        
        timeoutState = setTimeout(countDown, 1000);
        
    }
    
    
    // play alarm sound
    function playSound() {
        var alarm = new Audio('http://www.myinstants.com/media/sounds/alert-hq.mp3');
        alarm.play();
    }
    
    
    // reset
    function reset() {
        if (timerIsRunning) {
            timerIsRunning = false;
            clearTimeout(timeoutState);
        }        
        minutes = sessionLength;
        sessionState = 'Session';
        seconds = 0;
        render();
    }
    
    
    // render controls
    function renderControls() {
        DOM.$breakLength.html(breakLength);
        DOM.$sessionLength.html(sessionLength);
    }
    
    
    // render time
    function renderTime() {
        DOM.$minutes.html(zeroPad(minutes));
        DOM.$seconds.html(zeroPad(seconds));
    }
    
    
    // render timer label
    function renderLabel() {
        DOM.$sessionLabel
            .toggleClass('redish', sessionState === 'Break')
            .html(sessionState);
    }
    
    
    // main renderer
    function render() {
        renderControls();
        renderTime();
        renderLabel();
    }
    
    
    // auto-init on page load
    (function init() {
        cacheDom();
        bindEvents();
        render();
    }());
    
}(jQuery));
