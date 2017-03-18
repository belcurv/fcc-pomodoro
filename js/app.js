/* jshint esversion:6 */
/* globals jQuery, console, setTimeout, clearTimeout */

/*
 * Javascrit Pomodoro-style timer
 *
 *
*/

(function ($) {
    
    'use strict';
    
    var breakLength = 5,
        sessionLength = 2,
        minutes = sessionLength,
        seconds = 0,
        timerIsRunning = false,
        timerState,
        DOM = {};   // cached DOM elements
        

    /* =============================== setup =============================== */
    
    // cache DOM elements
    function cacheDom() {
        
        DOM.$controls      = $('.controls');

        DOM.$breakLength   = DOM.$controls.find('#break-length');
        DOM.$sessionLength = DOM.$controls.find('#session-length');
        
        DOM.$timer         = $('#timer');
        DOM.$minutes       = DOM.$timer.find('#minutes');
        DOM.$seconds       = DOM.$timer.find('#seconds');
        
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
                clearTimeout(timerState);
            }
            
            timerIsRunning = !timerIsRunning;
        }         
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
            timerIsRunning = false;
            return;
        } else if (seconds <= 0 && minutes >= 0) {
            seconds = 59;
            minutes -= 1;
        } else if (seconds > 0) {
            seconds -= 1;
        }
        
        timerState = setTimeout(countDown, 250);
        
    }
    
    
    
    // reset
    function reset() {
        timerIsRunning = false;
        minutes = sessionLength;
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
    
    // main renderer
    function render() {
        renderControls();
        renderTime();
    }
    

    // auto-init on page load
    (function init() {
        cacheDom();
        bindEvents();
        render();
    }());
    
}(jQuery));
