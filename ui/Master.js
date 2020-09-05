import {Window} from './Window.js';
import {Dragbar} from './Dragbar.js'
import {VerticalDragbar} from './VerticalDragbar.js'
import {HorizontalDragbar} from './HorizontalDragbar.js'

export * from './Window.js';
export * from './Dragbar.js'
export * from './VerticalDragbar.js'
export * from './HorizontalDragbar.js'


export class Master{
	constructor(containerId){
		this.windows = [];
		this.dragbars = [];

		this.id = containerId;
		this.setContainer(containerId);

		this.MIN_WIDTH = 5;
		this.MIN_HEIGHT = 5;

		this.ifSomeAction = false;

		this.dragbarCounter = 1;
		this.windowCounter = 1;

		this.menuOptions = new Set();

	}

	setContainer(id){
		this.container = document.getElementById(id);
	}

	setIfSomeAction(value){
		this.ifSomeAction = value;
	}

	getIfSomeAction(){
		return this.ifSomeAction;
	}
	
	getDragbarCounter(){
		return this.dragbarCounter;
	}

	dragbarCounterPlusPlus(){
		this.dragbarCounter++;
	}

	getWindowCounter(){
		return this.windowCounter;
	}

	windowCounterPlusPlus(){
		this.windowCounter++;
	}

	pushWindow(div){
		this.windows.push(div);

	}

	pushDragbar(div){
		this.dragbars.push(div);
	}

	makeLayout(){
		this.windows.forEach(element => element.fitTheAreaBetweenDragbars());
		this.dragbars.forEach(element => element.fitToWindows());
	}

	createDiv(id, extraClasses){
		var div = document.createElement("div");
		div.id = id;
		div.setAttribute("class", "ui-widget-content " + extraClasses);
		console.log("The new " + id + " was created!")
		return this.container.appendChild(div);	
	}


	removeDiv(id){
		var div = document.getElementById(id);
	    div.parentNode.removeChild(div);
	    console.log(id + " was deleted!")
	}


	addMenuOption(name){
		this.menuOptions.add(name);
		this.windows.forEach(element => element.updateMenu());
	}

	getPosition(div){
		let containerPosition = this.container.getBoundingClientRect();
		
		let left = Master.getPositionPx(div).left/containerPosition.width * 100;
		let top = Master.getPositionPx(div).top/containerPosition.height * 100;
		let width = Master.getPositionPx(div).width/containerPosition.width * 100;
		let height = Master.getPositionPx(div).height/containerPosition.height * 100;
		let right = left + width;
		let bottom = top + height;
		return {left:left, top:top, right: right, bottom:bottom, width:width, height:height};
	}

	static getPositionPx(div){
		//getBoundingClientRect() does not work correctly in dynamical change
		let left = parseInt($(div).css('left'), 10)
		let top = parseInt($(div).css('top'), 10)
		let width = parseInt($(div).css('width'), 10)
		let height = parseInt($(div).css('height'), 10)
		let right = left + width;
		let bottom = top + height;
		return {left:left, top:top, right: right, bottom:bottom, width:width, height:height};
	}

	static createDiv(parent, id, extraClasses){
		var div = document.createElement("div");
		div.id = id;
		div.setAttribute("class", extraClasses);
		console.log("The new " + id + " was created!")
		return parent.appendChild(div);	
	}
	

}

