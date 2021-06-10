
// Mafia, boilerplate code taken from "Boids"

import * as Utility from "../client-modules/utility.js";
import {Vector2} from "../client-modules/vector2.js";
import Canvas from "../client-modules/canvas.js";
import {instances, Instance, sortInstancesBasedOnRenderPriority} from "../client-modules/instance.js";
import Entity from "../client-modules/entity.js";
import Actor from "../client-modules/actor.js";
import Camera from "../client-modules/camera.js";
import Boid from "../client-modules/boid.js";
import Player from "../client-modules/player.js";
import Effect from "../client-modules/effect.js";
import {UserInputService, controlsApplyTo} from "../client-modules/userInputService.js";

const getElement = Utility.getElement;

export const renderPriority = [
	"Instance", "Entity", "Actor",
	"Player", "Boid", "Effect", "Camera"
];
export var mouse = {x: undefined, y: undefined};
export var deltaTimeMultiplier = 1;

const mainCanvas = new Canvas(Utility.getElement("#canvas"));
// mainCanvas.active = false;
window.addEventListener("resize", mainCanvas.resize.bind(mainCanvas));
export {mainCanvas};

const mainPlayer = new Player();
mainPlayer.setName("Main Player");
controlsApplyTo.set(mainPlayer.id, mainPlayer);
window.addEventListener("keydown", UserInputService.whenKeyboardDown);
window.addEventListener("keyup", UserInputService.whenKeyboardUp);
mainCanvas.canvasElement.addEventListener("mousedown", UserInputService.whenMouseDown);
mainCanvas.canvasElement.addEventListener("mouseup", UserInputService.whenMouseUp);
mainCanvas.canvasElement.addEventListener("click", UserInputService.whenMouseClick);
mainCanvas.canvasElement.addEventListener("mousemove", UserInputService.whenMouseMove);
export {mainPlayer};


const mainCamera = new Camera();
mainCamera.setPosition(0, 0).setAnchored(true);
mainCanvas.setCamera(mainCamera);
mainPlayer.bindControlsTo(mainCamera);
export {mainCamera};
console.log(mainPlayer);
mainPlayer.setPosition(new Vector2(0, 0)).setTransparency(1).setCanCollide(false).setAnchored(true);



let randoClasses = {
	"Instance": Instance,
	"Entity": Entity,
	"Actor": Actor,
	"Player": Player,
	"Effect": Effect,
	"Camera": Camera,
};

const numberOfBoidsToSpawn = Math.min(
	Math.max(
		20,
		Math.floor(Math.random() * 2 * Number(mainCanvas.canvasElement.width / mainCanvas.canvasElement.height))
	),
	100
);
// const numberOfBoidsToSpawn = 200;
for (let i=0; i<numberOfBoidsToSpawn; i+=1) {
	const boid = new Boid();
	boid.setPosition(
		new Vector2(
			mainCamera.getPosition.getX + mainCanvas.canvasElement.halfWidth  * (Math.random() * 2 - 1),
			mainCamera.getPosition.getY + mainCanvas.canvasElement.halfHeight * (Math.random() * 2 - 1)
		)
		
	);
}



// sortInstancesBasedOnRenderPriority();
// setTimeout(()=>{
// 	sortInstancesBasedOnRenderPriority();
// }, 60000);


const cardsToLinks = {
	"boids": "https://pleasant-boids.herokuapp.com"
};
class PortfolioCard extends HTMLDivElement {
	constructor(card_name) {
		super();

		this.card_name = card_name;
		this.classList = "card dark";

		this.style.backgroundImage = `url("./images/${card_name}.png")`;

		const h2 = document.createElement("h2");
		const formattedName = [String(card_name[0]).toUpperCase(), card_name.slice(1)].join("");
		console.log(formattedName);
		h2.innerHTML = formattedName;
		this.appendChild(h2);

		// const a = document.createElement("a");


		if (cardsToLinks[card_name] !== undefined) {
			this.style.cursor = "pointer";
			this.addEventListener("click", ()=>{
				window.location.assign(cardsToLinks[this.card_name]);
			});
		}
	}
	setImage(card_name) {
		this.card_name = card_name;
		this.style.backgroundImage = `url("./images/${card_name}.png")`;

	}
}
customElements.define("portfolio-card", PortfolioCard, { extends: "div" });


const portfolioCards = new Map();
const section_cardGrid = getElement(`section[name="card-grid"]`);
const imageNames = ["boids", "physics-engine", "circles"];
for (let name of imageNames) {
	const portfolioCard = new PortfolioCard(name);
	portfolioCards.set(name, portfolioCard);
	section_cardGrid.appendChild(portfolioCards.get(name));
}
[...portfolioCards.values()][1].classList.replace("dark", "light");
[...portfolioCards.values()][2].classList.replace("dark", "light");



console.log(`[%cMAIN client.js%c] Loaded.`, "color: purple", "color: black");
window.requestAnimationFrame(mainCanvas.update.bind(mainCanvas));
