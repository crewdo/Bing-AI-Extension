// ------------------ Fake Microsoft Edge to use Bing AI ----------------
const MOBILE_UA_SUFFIX = 'EdgA/110.0.1587.41';

let nextRuleId = Math.floor( (new Date).getTime() / 1000 % 160000000);
const rule = {
	id: nextRuleId++,
	priority: 1,
	action: {
		type: 'modifyHeaders',
		requestHeaders: [
			{
				header: 'user-agent',
				operation: 'set',
				value: `${navigator.userAgent}${MOBILE_UA_SUFFIX}`
			}
		]
	},
	condition: {
		urlFilter: '*://*.bing.com/*',
		resourceTypes: ['main_frame']
	}
};

chrome.declarativeNetRequest.updateDynamicRules({addRules: [rule]});

chrome.tabs.query({active: true, currentWindow: true}).then(([tab]) => {
	if (tab.url?.startsWith("chrome://")) return undefined;

	try {
		if (tab.url.contains("bing.com")) {
			chrome.scripting.executeScript({
				target: {tabId: tab.id},
				files: ['client.js']
			});
		} else {
			return undefined;
		}
	} catch (e) {
		return undefined;
	}
});
// ------------------ End Fake Microsoft Edge to use Bing AI ----------------

//------------- Bing AI messages log and count -------------
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.greeting == "hello") {
			const newMessageItem = {timestamp: Date.now()};
			updateStorage(newMessageItem);
		}
	});

const checkAndRemove = (arr) => {
	const now = Date.now();
	return arr.filter(item => now - item.timestamp < 24 * 60 * 60 * 1000);
};

const updateStorage = (newItem) => {
	chrome.storage.local.get(['BingAIMessageLogs'], function (result) {
		let BingAIMessageLogs = result.BingAIMessageLogs || [];
		BingAIMessageLogs = checkAndRemove(BingAIMessageLogs);
		BingAIMessageLogs.unshift(newItem);
		chrome.storage.local.set({BingAIMessageLogs: BingAIMessageLogs});

		chrome.action.setBadgeText({text: String(BingAIMessageLogs.length)});
	});
};

const countLastBingAIMessages = () => {
	chrome.storage.local.get(['BingAIMessageLogs'], function (result) {
		let BingAIMessageLogs = result.BingAIMessageLogs || [];
		BingAIMessageLogs = checkAndRemove(BingAIMessageLogs);
		chrome.storage.local.set({BingAIMessageLogs: BingAIMessageLogs});
		// Show the count in the popup
		chrome.action.setBadgeText({text: String(BingAIMessageLogs.length)});
	});
};

chrome.action.onClicked.addListener((tab) => {
	countLastBingAIMessages();
});
//------------- END Bing AI messages log and count -------------