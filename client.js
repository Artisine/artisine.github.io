


function getElement(query) {
	return document.querySelector(query);
}

const portfolioElements = {
	"header": getElement(".portfolio#header"),
	"verticalList": getElement(".portfolio#vertical-list")
};

// portfolioElements.header.style.marginTop = `calc(50vh - ${portfolioElements.verticalList.clientHeight}px)`;
portfolioElements.header.style.top = `${portfolioElements.header.clientHeight/2}px`;



















console.info(`[%cMAIN client.js%c] %cLoaded.`, "color: purple", "color: black", "color: green");