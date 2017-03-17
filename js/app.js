/* jshint esversion:6 */
/* globals jQuery, console, RPN */

/*
 * Javascrit Pomodoro-style timer
 *
 *
*/

(function ($) {
    
    'use strict';
    
    var breakLength = 5,
        sessionLength = 25,
        minutes = sessionLength,
        seconds = 59,
        DOM = {};   // cached DOM elements
        

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
            
            countDown();
            
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
    
    
    // countDown
    function countDown() {
        
        if (seconds < 0 && minutes >= 0) {
            minutes -= 1;
        } else if (seconds > 0) {
            console.log('here');
            render();
            seconds -= 1;
            setTimeout(countDown, 1000);
        }
        
        
    }
    
    /* zero pad single-digit minutes & seconds
     *
     * @param    [number]   time   [time]
     * @returns  [string]          [time with leading 0 if needed]
    */
    function zeroPad(time) {
        return ('0' + time).substr(-2);
    }
    
    
    // reset
    function reset() {
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
        DOM.$minutes.html(zeroPad(sessionLength));
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
