import * as Utility from "./utility.js";
import {renderPriority} from "../client.js";

function insertionSort(inputArr) {
	let n = inputArr.length;
		for (let i = 1; i < n; i++) {
			// Choosing the first element in our unsorted subarray
			let current = inputArr[i];
			// The last element of our sorted subarray
			let j = i-1; 
			while ((j > -1) && (current < inputArr[j])) {
				inputArr[j+1] = inputArr[j];
				j--;
			}
			inputArr[j+1] = current;
		}
	return inputArr;
}

export var instances = new Map();
export var boids = [];
export var instancesBeingSorted = false;
export function sortInstancesBasedOnRenderPriority() {
	let insertionInputArray = [];

	for (let i=0; i<renderPriority.length; i+=1) {
		let toPush = [...instances.values()].filter(item => item.className === renderPriority[i]);
		// console.log(toPush);
		insertionInputArray = [...insertionInputArray, ...toPush];
	}

	// console.log(insertionInputArray);

	instancesBeingSorted = true;

	const replacementMap = new Map();

	for (let obj of insertionInputArray) {
		replacementMap.set(obj.id, obj);
	}
	instances.clear();
	instances = replacementMap;

	instancesBeingSorted = false;

	// return insertionInputArray;
	return instances;
}

export class Instance {
	constructor() {
		this.className = "Instance";
		this.name = "Instance";
		this.id = Utility.generateID();
		this.parent = null;

		if (!!! instances.get(this.id)) {
			instances.set(this.id, this);
		}
		// console.log(instances.get(this.id));
		// console.log(`${this.className} ${this.id} created.`);

		return instances.get(this.id);
	}
	destroy() {
		instances.delete(this.id);
		// console.log(`Destroyed ${this.id}`);
	}
	get getClassName() {
		return this.className;
	}
	get getName() {
		return this.name;
	}
	get getId() {
		return this.id;
	}
	setName(name) {
		this.name = name;
		return this;
	}
	setParent(parent) {
		this.parent = parent;
		return this;
	}
	
};