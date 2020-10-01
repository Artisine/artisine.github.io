import {Math_rad, Math_deg, distanceBetweenPoints} from "./utility.js";
import {mainCanvas, mainCamera, deltaTimeMultiplier} from "../client.js";
import {instances, Instance, boids} from "./instance.js";
import Entity from "./entity.js";
import Actor from "./actor.js";
import { Vector2, zeroedVector2 } from "./vector2.js";

const oneOverSixty = 1 / 60;
const tenOverSixty = 10 / 60;
const hundredOverSixty = 100 / 60;
const thousandOverSixty = 1000 / 60;

export default class Boid extends Entity {
	constructor() {
		super();

		this.className = "Boid";
		this.name = "Boid";

		this.setSize(25, 15);
		this.rotation = 50;

		this.maximumSpeed = 10;
		this.standardSpeed = 1;
		this.angleFieldOfView = 270;
		this.radiusForFieldOfView = this.getSize.getX * 4;
		this.shouldTeleportToOtherSideOfScreen = true;
		this.otherBoidsInViewfield = new Map();
		this.rulesEnabled = [true, true, true];
		this.showRadiusForFieldOfView = false;
		this.intervalBetweenSuddenVelocityIncrease = Math.min(10, Math.random() * 30);
		this.durationProgressSuddenVelocityIncrease = 0;
		this.boidGroup = Math.floor(Math.random() * 2);
		this.alive = true;
		this.deathColor = "#b3aead";
		this.deathDecayDuration = 7000;
		this.deathDecayProgress = 0;
		this.showCorpse = false;

		// console.log(`radiusForFieldOfView: ${this.radiusForFieldOfView}`);
		this.colors = ["#03045e","#023e8a","#0077b6","#0096c7","#00b4d8","#48cae4","#90e0ef","#ade8f4","#caf0f8"];
		this.determinedColor = this.colors[Math.floor(Math.random() * this.colors.length)];

		boids.push(this);
		// console.log(boids);
		this.init();
	}
	move() {
		if (! this.alive) return 1;
		this.addVelocity(
			deltaTimeMultiplier * this.getAcceleration.getX / 60,
			deltaTimeMultiplier * this.getAcceleration.getY / 60
		);
		this.addPosition(
			deltaTimeMultiplier * this.getVelocity.getX / 60,
			deltaTimeMultiplier * this.getVelocity.getY / 60
		);
	}
	death() {
		if (this.invulnerable) return this;
		console.log(`${this.getClassName} ${this.getName} ${this.getId} died.`);
		this.alive = false;
	}
	destroy() {
		console.log(`Destroying ${this.id}`);
		// boids = boids.splice(
		// 	boids.filter(item => {
		// 		return item.id === this.id;
		// 	})[0]
		// );
		let index = null;
		const len = boids.length;
		for (let i = 0; i < len; i += 1) {
			if (boids[i].id === this.id) {
				index = i;
				console.log(`Found it, index of ${index}`);
			}
		}
		boids.splice(index, 1);
		instances.delete(this.id);
		delete this;
		return true;
	}
	init() {
		this.setRotation(Math.random() * 360);
		this.velocity.set(
			Math.cos(Math_rad(this.getRotation)) * this.standardSpeed,
			Math.sin(Math_rad(this.getRotation)) * this.standardSpeed
		);
		// this.getVelocity.set(1, 2);
	}

	distanceFromOtherBoid(otherBoid) {
		if (otherBoid instanceof Boid) {
			return Math.sqrt(
				(this.position.getX - otherBoid.position.getX) * (this.position.getX - otherBoid.position.getX)
				+ (this.position.getY - otherBoid.position.getY) * (this.position.getY - otherBoid.position.getY)
			);
		}
	}
	checkIfBoidIsFromSameBoidGroup(otherBoid) {
		if (otherBoid instanceof Boid && otherBoid.id !== this.id && otherBoid.boidGroup === this.boidGroup) {
			return true;
		} else {
			return false;
		}
	}


	findOtherBoidsInViewingField() {
		for (let i = 0; i < boids.length; i += 1) {
			const otherBoid = boids[i];
			if (otherBoid.id === this.id) {
				continue;
			}

			const dist = Math.abs(otherBoid.getPosition.getMagnitude() - this.getPosition.getMagnitude());
			if (dist <= this.radiusForFieldOfView) {
				if (this.otherBoidsInViewfield.get(otherBoid.id) === undefined) {
					this.otherBoidsInViewfield.set(otherBoid.id, otherBoid);
				}
			} else {
				if (this.otherBoidsInViewfield.get(otherBoid.id)) {
					this.otherBoidsInViewfield.delete(otherBoid.id);
				}
			}
		}
	}

	rule1_coherrence() {
		const centeringFactor = 0.010;
		// adjust velocity by this %

		let centerX = 0;
		let centerY = 0;
		let numberOfNeighbours = 0;

		for (let otherBoid of boids) {
			if (this.checkIfBoidIsFromSameBoidGroup(otherBoid) && this.distanceFromOtherBoid(otherBoid) < this.radiusForFieldOfView) {
				centerX += otherBoid.position.getX;
				centerY += otherBoid.position.getY;
				numberOfNeighbours += 1;
			}
		}
		if (numberOfNeighbours) {
			centerX = centerX / numberOfNeighbours;
			centerY = centerY / numberOfNeighbours;

			this.velocity.add(
				(centerX - this.position.getX) * centeringFactor,
				(centerY - this.position.getY) * centeringFactor
			);
		}
	}
	rule2_separation() {
		const minDistance = 40; // The distance to stay away from others
		const avoidFactor = 0.25; //adjust velocity by this %
		let moveX = 0;
		let moveY = 0;
		for (let otherBoid of boids) {
			if (otherBoid.id !== this.id && this.checkIfBoidIsFromSameBoidGroup(otherBoid)) {
				if (this.distanceFromOtherBoid(otherBoid) < minDistance) {
					moveX += this.getPosition.getX - otherBoid.getPosition.getX;
					moveY += this.getPosition.getY - otherBoid.getPosition.getY;
				}
			}
		}

		this.velocity.add(
			moveX * avoidFactor,
			moveY * avoidFactor
		);
	}
	rule3_alignment() {
		const matchingFactor = 0.25;
		let averageDX = 0;
		let averageDY = 0;
		let numberOfNeighbours = 0;

		for (let otherBoid of boids) {
			if (this.checkIfBoidIsFromSameBoidGroup(otherBoid) && this.distanceFromOtherBoid(otherBoid) < this.radiusForFieldOfView) {
				averageDX += otherBoid.velocity.getX;
				averageDY += otherBoid.velocity.getY;
				numberOfNeighbours += 1;
			}
		}
		if (numberOfNeighbours) {
			averageDX = averageDX / numberOfNeighbours;
			averageDY = averageDY / numberOfNeighbours;

			this.velocity.add(
				(averageDX - this.velocity.getX) * matchingFactor,
				(averageDY - this.velocity.getY) * matchingFactor
			);
		}
	}
	keepWithinBounds() {
		if (this.shouldTeleportToOtherSideOfScreen) {
			return 1;
		}
		const margin = 20;
		const turnFactor = 10000;

		const left  = mainCamera.position.getX - mainCanvas.canvasElement.width * 0.5;
		const right = mainCamera.position.getX + mainCanvas.canvasElement.width * 0.5;
		const up   = mainCamera.position.getY - mainCanvas.canvasElement.height * 0.5;
		const down = mainCamera.position.getY + mainCanvas.canvasElement.height * 0.5;
	  
		if (this.position.getX < left + margin) {
			// this.dx += turnFactor;
			this.velocity.add(turnFactor, 0);
		}
		if (this.position.getX > right - margin) {
			// this.dx -= turnFactor
			this.velocity.add(-turnFactor, 0);
		}
		if (this.position.getY < up + margin) {
			// this.dy += turnFactor;
			this.velocity.add(0, turnFactor);
		}
		if (this.position.getY > down - margin) {
			// this.dy -= turnFactor;
			this.velocity.add(0, -turnFactor);
		}
	}
	introduceRandomVelocityIncrease() {
		if (Math.random() > 0.9999) {
			this.velocity.add((Math.random() - 0.5) * 100000, (Math.random() - 0.5) * 100000);
		}
	}
	suddenVelocityIncrease() {
		this.velocity.set(
			this.velocity.getX * 10,
			this.velocity.getY * 10
		);
	}

	introduceRandomVelocityMultiply() {
		if (Math.random() > 0.99) {
			this.suddenVelocityIncrease();
		}
	}

	simulateRules() {
		if (this.alive) {
			this.durationProgressSuddenVelocityIncrease += 1 / 60;
			if (this.durationProgressSuddenVelocityIncrease >= this.intervalBetweenSuddenVelocityIncrease) {
				this.suddenVelocityIncrease();
			}
			this.rule1_coherrence();
			this.rule2_separation();
			this.rule3_alignment();
			this.keepWithinBounds();
			this.introduceRandomVelocityIncrease();
			this.introduceRandomVelocityMultiply();
			this.limit_velocity();
			if (this.isWithinHellfire()) {
				this.addHealth(-hundredOverSixty);
			}
		}
	}
	limit_velocity() {
		const speedLimit = 100;
		const speed = Math.sqrt(this.velocity.getX * this.velocity.getX + this.velocity.getY * this.velocity.getY);
		if (speed > speedLimit) {
			this.velocity.setX((this.velocity.getX / speed) * speedLimit);
			this.velocity.setY((this.velocity.getY / speed) * speedLimit);
		}
	}


	isWithinHellfire() {
		for (let obj of [...instances.values()].filter(item => item.getClassName === "Hellfire")) {
			const dist = distanceBetweenPoints(this.getPosition, obj.getPosition);
			if (dist <= obj.maxRadius && obj.firing) {
				return true;
			}
		}
		return false;
	}



	
	get getRotationBasedOnVelocity() {
		return Math.atan2(this.velocity.getY, this.velocity.getX);
	}

	render() {
		if (mainCanvas.lighthouseMode && !mainCanvas.camera.canSeeBoid(this)) {
			return 1;
		}
		if (! this.alive) {
			this.deathDecayProgress += thousandOverSixty;
			this.setTransparency(1 - (this.deathDecayProgress / this.deathDecayDuration));
			if (this.deathDecayProgress >= this.deathDecayDuration) {
				this.destroy();
			}
		}
		if (this.alive || (!this.alive && this.showCorpse)) {
			// console.log("Alive | Dead and show Corpse");
			if (!this.alive && this.showCorpse) {
				console.log("Dead and show corpse");
			}
			mainCanvas.ctx.save();
			mainCanvas.ctx.translate(this.getPosition.getX, this.getPosition.getY);
			mainCanvas.ctx.rotate( this.getRotationBasedOnVelocity );
			// mainCamera.ctx.globalAlpha = 1 - this.getTransparency;
	
			mainCanvas.changeLineWidth(0);
	
			// Step 1 - Render a big fat triangle and call it a day.
			mainCanvas.beginNewPath();
			mainCanvas.ctx.moveTo(
				-this.getSize.getX/2,
				-this.getSize.getY/2
			);
			mainCanvas.ctx.lineTo(
				this.getSize.getX/2, 0
			);
			mainCanvas.ctx.lineTo(
				-this.getSize.getX/2,
				this.getSize.getY/2
			);
			mainCanvas.ctx.lineTo(
				-this.getSize.getX/2,
				-this.getSize.getY/2
			);
			mainCanvas.closeNewPath();
			mainCanvas.strokeprevious("black");
			if (this.alive) mainCanvas.fillprevious(this.determinedColor);
			else mainCanvas.fillprevious(this.deathColor);
	
			// Step 2 - Render Circle for "radiusForFieldOfView"
			if (this.showRadiusForFieldOfView && this.alive) {
				mainCanvas.circle(0, 0, this.radiusForFieldOfView);
				mainCanvas.strokeprevious("white");
			}
	
			mainCanvas.ctx.restore();
			mainCanvas.ctx.fillStyle = "white";
			mainCanvas.ctx.fillText(`${this.boidGroup}`, this.position.getX, this.position.getY + 20);
		}
	}
};