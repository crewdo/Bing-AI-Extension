function getStopRespondButtonElement()
{
    return (function querySelectorAllShadows(selector, el = document.body) {
        const childShadows = Array.from(el.querySelectorAll('*')).map(el => el.shadowRoot).filter(Boolean);
        const childResults = childShadows.map(child => querySelectorAllShadows(selector, child));
        const result = Array.from(el.querySelectorAll(selector));

        return result.concat(childResults).flat();
    })('#stop-responding-button');
}

function observeWaitingRepondButton() {
    window.stopRespondButton = getStopRespondButtonElement();

    if (! window.stopRespondButton.length) {
        console.log('Initialize observeWaitingRepondButton() failed.');
        return;
    }

    let target = window.stopRespondButton[0];
    let observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'attributes') {
                if (mutation.attributeName === 'disabled' && ! target.hasAttribute('disabled')) {
                    const event = new CustomEvent("onWaitingRepondButtonShowing", {detail: "hello"});
                    document.dispatchEvent(event);
                }
            }
        });
    });

    window.observationHandler = observer;
    window.observationTarget = target;

    observer.observe(target, {attributes: true});
}

setTimeout(observeWaitingRepondButton, 1200);

//Prevent browser idle.
setInterval(function () {
    if (window.observationTarget && window.observationHandler && window.stopRespondButton[0] === getStopRespondButtonElement()[0]) {
        window.observationHandler.observe(window.observationTarget, {attributes: true});
    } else {
        console.log('Re-initialize target');
        observeWaitingRepondButton();
    }
}, 4000);