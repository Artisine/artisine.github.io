
// Mafia, boilerplate code taken from "Boids"

import * as Utility from "./client-modules/utility.js";
import {Vector2} from "./client-modules/vector2.js";
import Canvas from "./client-modules/canvas.js";
import {instances, Instance, sortInstancesBasedOnRenderPriority} from "./client-modules/instance.js";
import Entity from "./client-modules/entity.js";
import Actor from "./client-modules/actor.js";
import Camera from "./client-modules/camera.js";
import Boid from "./client-modules/boid.js";
import Player from "./client-modules/player.js";
import Effect from "./client-modules/effect.js";
import {UserInputService, controlsApplyTo} from "./client-modules/userInputService.js";

const getElement = Utility.getElement;

export const renderPriority = [
	"Instance", "Entity", "Actor",
	"Player", "Boid", "Effect", "Camera"
];
export var mouse = {x: undefined, y: undefined};
export var deltaTimeMultiplier = 1;

const mainCanvas = new Canvas(Utility.getElement("#canvas"));
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


for (let i=0; i<50; i+=1) {
	const boid = new Boid();
	boid.setPosition(
		mainCanvas.canvasElement.width * Math.random(),
		mainCanvas.canvasElement.height * Math.random()
	);
}



sortInstancesBasedOnRenderPriority();
setTimeout(()=>{
	sortInstancesBasedOnRenderPriority();
}, 60000);







console.log(`[%cMAIN client.js%c] Loaded.`, "color: purple", "color: black");
window.requestAnimationFrame(mainCanvas.update.bind(mainCanvas));
