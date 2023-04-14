//---------- Counting message function by observe the Stop Respond Button ------------
document.addEventListener("onWaitingRepondButtonShowing", function(event) {
    chrome.runtime.sendMessage({greeting: event.detail});
});

const url = chrome.runtime.getURL('inject.js');
const script = document.createElement('script');
script.src = url;
document.head.appendChild(script);

//---------- Stop Bad Scroll function ------------
function myListener(e) {
    e.stopImmediatePropagation();
}

window.addEventListener('mousewheel', myListener, true);
//---------- End Stop Bad Scroll function ------------


//---------------- Remove Character Limitation ----------
function waitForElement(parent, selector) {
    return new Promise((resolve, reject) => {
        const interval = setInterval(function () {
            const element = parent.querySelector(selector);

            if (element) {
                clearInterval(interval);
                resolve(element);
            }
        }, 10);
    });
}

const removeLimitation = () => {
    waitForElement(document, ".cib-serp-main")
    .then(mainHost => {
        const mainRoot = mainHost.shadowRoot;
        return waitForElement(mainRoot, "#cib-action-bar-main");
    })
    .then(secondHost => {
        const secondRoot = secondHost.shadowRoot;
        return Promise.all([
            waitForElement(secondRoot, "#searchbox"),
            waitForElement(secondRoot, ".letter-counter"),
            secondRoot
        ]);
    })
    .then(([searchInput, letterCounter, secondRoot]) => {
        searchInput.removeAttribute("maxlength");
        letterCounter.childNodes[letterCounter.childNodes.length - 1].textContent = "♾️";

        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (!searchInput.isConnected) {
                    removeLimitation();
                    observer.disconnect();
                }
            }
        });

        observer.observe(secondRoot, { childList: true });
    });
};

removeLimitation();
//---------------- End Remove Character Limitation ----------

//---------------- Command helpers --------------------------
waitForElement(document, "#b_header").then(header => {
    let newDiv = document.createElement('div');
    newDiv.style.display = 'block';
    newDiv.style.position = 'absolute';
    newDiv.style.zIndex = '10000';
    newDiv.style.top = '0px';
    newDiv.style.padding = '10px';
    newDiv.innerHTML = 'Please optimize and make this code more concise and professional. Maintaining original behavior is a must:';
    header.insertAdjacentElement('beforebegin', newDiv);
});

waitForElement(document, "#tallhead").then(tallheader => {
    tallheader.innerHTML = '';
});

waitForElement(document, ".b_scopebar").then(scopeBar => {
    scopeBar.style.display = 'none';
});