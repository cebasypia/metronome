(function () {
    const interval = 100;
    let timer;
    const ua = navigator.userAgent.toLowerCase();
    const isSP = /iphone|ipod|ipad|android/.test(ua);
    // const b = document.getElementById('button');
    const eventStart = isSP ? 'touchstart' : 'mousedown';
    const eventEnd = isSP ? 'touchend' : 'mouseup';
    const eventLeave = isSP ? 'touchmove' : 'mouseleave';

    function touchEventStart(elementArg, functionArg) {
        elementArg.addEventListener(eventStart, function (e) {
            e.preventDefault();
            functionArg();
            timer = setInterval(() => {
                functionArg();
            }, interval);
        });
    };

    function touchEventEnd(elementArg) {
        elementArg.addEventListener(eventEnd, e => {
            e.preventDefault();
            clearInterval(timer);
            // if (count) {
            // elementArg.classList.remove('active');
            // }
        });
    };

    function touchEventLeave(elementArg) {
        elementArg.addEventListener(eventLeave, e => {
            e.preventDefault();
            let pointedElement = isSP ? document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY) : elementArg;
            if (!isSP || pointedElement !== elementArg) {
                clearInterval(timer);
            }
        });
    }

    addLongTouchEvent = function (elementArg, functionArg) {
        touchEventStart(elementArg, functionArg);
        touchEventEnd(elementArg);
        touchEventLeave(elementArg);
    };
})();