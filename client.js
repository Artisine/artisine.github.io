


function getElement(query) {
	return document.querySelector(query);
}

const portfolioElements = {
	"header": getElement(".portfolio#header"),
	"verticalList": getElement(".portfolio#vertical-list")
};

// portfolioElements.header.style.marginTop = `calc(50vh - ${portfolioElements.verticalList.clientHeight}px)`;
portfolioElements.header.style.top = `${portfolioElements.header.clientHeight/2}px`;

const leftSection = getElement(`section#left`);
const rightSection = getElement(`section#right`);

const articles = [...leftSection.children].filter((child) => child.localName === "article" && child.classList.contains("portfolio"));
console.log(articles);

console.log(leftSection.offsetTop);

function when_scroll(e) {
	const evt = e || event;
	// console.log(evt);
	// leftSection
	// console.log(`${leftSection.scrollTop}`);
}

leftSection.addEventListener("scroll", when_scroll);
// rightSection.addEventListener("scroll", when_scroll);


function something() {

	articles.forEach((arti) => {
		if (leftSection.scrollTop >= arti.offsetTop && leftSection.scrollTop < (arti.offsetTop + arti.clientHeight)) {
			arti.classList.add("big-red");
		} else {
			arti.classList.remove("big-red");
		}
	});

	window.requestAnimationFrame(something);
}
something();








console.info(`[%cMAIN client.js%c] %cLoaded.`, "color: purple", "color: black", "color: green");