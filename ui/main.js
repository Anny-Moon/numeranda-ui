import {Window} from './Window.js';
import {Dragbar} from './Dragbar.js'
import {VerticalDragbar} from './VerticalDragbar.js'
import {HorizontalDragbar} from './HorizontalDragbar.js'

export * from './Window.js';
export * from './Dragbar.js'
export * from './VerticalDragbar.js'
export * from './HorizontalDragbar.js'

export var container = document.getElementById("container");

export function setContainer(div){
	container = div;
}

export function setContainerByID(id){
	//console.log("hi set")
	container = document.getElementById(id);
}

export var MIN_WIDTH = 1;
export var MIN_HEIGHT = 1;
export var ifSomeAction = false;

export function setIfSomeAction(value){
	ifSomeAction = value;
}

export function getIfSomeAction(){
	return ifSomeAction;
}

export function createDiv(id, extraClasses){
	var div = document.createElement("div");
	div.id = id;
	div.setAttribute("class", "ui-widget-content " + extraClasses);
	console.log("The new " + id + " was created!")
	return container.appendChild(div);	
}


export function removeDiv(id){
	var div = document.getElementById(id);
    div.parentNode.removeChild(div);
    console.log(id + " was deleted!")
}

export function getPositionPx(div){
	//getBoundingClientRect() does not work correctly in dynamical change
	let left = parseInt($(div).css('left'), 10)
	let top = parseInt($(div).css('top'), 10)
	let width = parseInt($(div).css('width'), 10)
	let height = parseInt($(div).css('height'), 10)
	let right = left + width;
	let bottom = top + height;
	return {left:left, top:top, right: right, bottom:bottom, width:width, height:height};
}

export function getPosition(div){
	let containerPosition = container.getBoundingClientRect();
	//console.log("div " + div);

	let left = getPositionPx(div).left/containerPosition.width * 100;
	let top = getPositionPx(div).top/containerPosition.height * 100;
	let width = getPositionPx(div).width/containerPosition.width * 100;
	let height = getPositionPx(div).height/containerPosition.height * 100;
	let right = left + width;
	let bottom = top + height;
	return {left:left, top:top, right: right, bottom:bottom, width:width, height:height};
}

var dragbarCounter = 1;
export function getDragbarCounter(){
	return dragbarCounter;
}
export function dragbarCounterPlusPlus(){
	dragbarCounter++;
}


var windowCounter = 1;

export function getWindowCounter(){
	return windowCounter;
}
export function windowCounterPlusPlus(){
	windowCounter++;
}


var windows = [];
var dragbars = [];

export function pushWindow(div){
	windows.push(div);

}

export function pushDragbar(div){
	dragbars.push(div);
}

export function makeLayout(){
	windows.forEach(element => element.fitTheAreaBetweenDragbars());
	dragbars.forEach(element => element.fitToWindows());
}


export function init(){
	windows.push(new Window("window1", "standardWindow"));
	windows.push(new Window("window2", "standardWindow"));
	windows.push(new Window("window3", "standardWindow"));
	windows.push(new Window("window4", "standardWindow"));
	windows.push(new Window("window5", "standardWindow"));


	dragbars.push(new VerticalDragbar("dragbar-1", "standardVerticalDragbar"));
	dragbars.push(new VerticalDragbar("dragbar-2", "standardVerticalDragbar"));
	dragbars.push(new HorizontalDragbar("dragbar-3", "standardHorizontalDragbar"));
	dragbars.push(new HorizontalDragbar("dragbar-4", "standardHorizontalDragbar"));




	dragbars[0].addLeftWindow(windows[0]);
	dragbars[0].addRightWindow(windows[1]);
	dragbars[0].addRightWindow(windows[2]);


	dragbars[1].addLeftWindow(windows[1]);
	dragbars[1].addLeftWindow(windows[2]);
	dragbars[1].addRightWindow(windows[3]);


	dragbars[2].addTopWindow(windows[1]);
	dragbars[2].addBottomWindow(windows[2]);


	dragbars[3].addBottomWindow(windows[4])
	dragbars[3].addTopWindow(windows[0]);
	dragbars[3].addTopWindow(windows[2]);
	dragbars[3].addTopWindow(windows[3]);

	windows[0].fitTheAreaBetweenDragbars()
	windows[1].fitTheAreaBetweenDragbars()
	windows[2].fitTheAreaBetweenDragbars()
	windows[3].fitTheAreaBetweenDragbars()

	windows[4].fitTheAreaBetweenDragbars()

}


