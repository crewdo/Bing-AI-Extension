//---------- Stop Bad Scroll function ----------------
function stopImmediatePropagationListener(e) {
	e.stopImmediatePropagation();
}

window.addEventListener('mousewheel', stopImmediatePropagationListener, true);
//---------- End Stop Bad Scroll function --------------

//----------------- Helper functions -------------------
function elementOnReady(parent, selector) {
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
//----------------- End Helper functions -------------------

//---------------- Remove Character Limitation -------------
const removeLimitation = () => {
	elementOnReady(document, ".cib-serp-main")
	.then(mainHost => {
		const mainRoot = mainHost.shadowRoot;
		return elementOnReady(mainRoot, "#cib-action-bar-main");
	})
	.then(secondHost => {
		const secondRoot = secondHost.shadowRoot;
		return Promise.all([
			elementOnReady(secondRoot, "#searchbox"),
			elementOnReady(secondRoot, ".letter-counter"),
			secondRoot
		]);
	})
	.then(([searchInput, letterCounter, secondRoot]) => {
		searchInput.removeAttribute("maxlength");
		letterCounter.childNodes[letterCounter.childNodes.length - 1].textContent = "♾️";

		const observer = new MutationObserver((mutationsList) => {
			for (const mutation of mutationsList) {
				if (! searchInput.isConnected) {
					removeLimitation();
					observer.disconnect();
				}
			}
		});

		observer.observe(secondRoot, {childList: true});
	});
};

removeLimitation();
//---------------- End Remove Character Limitation ----------

//---------------- Command helpers --------------------------
elementOnReady(document, "#b_header").then(header => {
	let newDiv = document.createElement('div');
	newDiv.style.display = 'block';
	newDiv.style.position = 'absolute';
	newDiv.style.zIndex = '10000';
	newDiv.style.top = '0px';
	newDiv.style.padding = '10px';
	newDiv.innerHTML = 'Please optimize and make this code more concise and professional. Maintaining original behavior is a must:';
	header.insertAdjacentElement('beforebegin', newDiv);
});

elementOnReady(document, "#tallhead").then(header => {
    header.innerHTML = '';
});

elementOnReady(document, ".b_scopebar").then(scopeBar => {
	scopeBar.style.display = 'none';
});

//---------- Observe Responding Button For Counting Message ---------------------
const observeRespondingButtonForCountingMessage = () => {
	elementOnReady(document, ".cib-serp-main")
    .then(mainHost => {
		const mainRoot = mainHost.shadowRoot;
		return elementOnReady(mainRoot, "#cib-action-bar-main");
	}).then(secondHost => {
		const secondRoot = secondHost.shadowRoot;
		return elementOnReady(secondRoot, "cib-typing-indicator");
	}).then(thirdHost => {
		const thirdRoot = thirdHost.shadowRoot;
		return elementOnReady(thirdRoot, "#stop-responding-button");
	}).then(button => {
		const observer = new MutationObserver((mutationsList) => {
			for (const mutation of mutationsList) {
				if (mutation.type === 'attributes') {
					if (mutation.attributeName === 'disabled' && ! button.hasAttribute('disabled')) {
						chrome.runtime.sendMessage({greeting: 'responding-button-appeared'});
					}
				}
			}
		});

		observer.observe(button, {attributes: true});
	});
};

observeRespondingButtonForCountingMessage();
//---------- End Observe Responding Button For Counting Message ---------------------
