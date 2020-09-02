import {Dragbar} from './Dragbar.js';
import {Window} from './Window.js';


export class VerticalDragbar extends Dragbar{
	constructor(id, extraClasses){
		if(extraClasses == "" || extraClasses == null)
			extraClasses = "standardVerticalDragbar";
		super(id, extraClasses);
		this.leftWindow = new Set();
		this.rightWindow = new Set();
		this.makeDraggable();
		this.makeDoubleClickable();
		
	}

	addLeftWindow(div){
		this.leftWindow.add(div);
		div.setWidth(numeranda.ui.getPosition(this.dragbar).left);
		div.setRightDragbar(this);
		
	}

	addRightWindow(div){
		this.rightWindow.add(div);
		div.setLeft(numeranda.ui.getPosition(this.dragbar).left);
		div.setLeftDragbar(this);
	}

	removeRightWindow(div){
		console.log(this.id + ": I will remove from my neighbours " + div.id);
		this.rightWindow.delete(div);

	}

	removeLeftWindow(div){
		console.log(this.id + ": I will remove from my neighbours " + div.id);
		this.leftWindow.delete(div);

	}


	setHeightPx(value){
		this.dragbar.style.height = value + "px";
	}

	setPosition(left){
		this.dragbar.style.left = left + "%";
	}

	/*fitToWindowsPx(){

		var s = new Set([...this.leftWindow, ...this.rightWindow])
		var a = Array.from(s);
		var bottomMax = numeranda.ui.getPositionPx(a[0].window).bottom;

		for (var i=1; i<a.length; i++){
  			if(bottomMax < numeranda.ui.getPositionPx(a[i].window).bottom)
  				bottomMax = numeranda.ui.getPositionPx(a[i].window).bottom;
		};
		
		this.dragbar.style.height = (bottomMax - numeranda.ui.getPositionPx(this.dragbar).top) + "px";

		var topMin = numeranda.ui.getPositionPx(a[0].window).top;
		for (var i=1; i<a.length; i++){
  			if(topMin > numeranda.ui.getPositionPx(a[i].window).top)
  				topMin = numeranda.ui.getPositionPx(a[i].window).top;
		};

		this.dragbar.style.top = topMin + "px";

		if(!numeranda.ui.getIfSomeAction() && numeranda.ui.getPositionPx(this.dragbar).height<numeranda.ui.MIN_HEIGHT){
			try{
				numeranda.ui.removeDiv(this.id);
			}

			catch{
				console.log("It was dead when I came. I swear!")
			}
		} 

	
	}*/

	fitToWindows(){

		var s = new Set([...this.leftWindow, ...this.rightWindow])
		var a = Array.from(s);
		var bottomMax = numeranda.ui.getPosition(a[0].window).bottom;

		
		var topMin = numeranda.ui.getPosition(a[0].window).top;
		for (var i=1; i<a.length; i++){
  			if(topMin > numeranda.ui.getPosition(a[i].window).top)
  				topMin = numeranda.ui.getPosition(a[i].window).top;
		};

		this.dragbar.style.top = topMin + "%";

		for (var i=1; i<a.length; i++){
  			if(bottomMax < numeranda.ui.getPosition(a[i].window).bottom)
  				bottomMax = numeranda.ui.getPosition(a[i].window).bottom;
		};
		
		this.dragbar.style.height = (bottomMax - numeranda.ui.getPosition(this.dragbar).top) + "%";


		if(!numeranda.ui.getIfSomeAction() && numeranda.ui.getPosition(this.dragbar).height<numeranda.ui.MIN_HEIGHT){
			try{
				console.log(this.id + " became too thin, so will be deleted.")
				numeranda.ui.removeDiv(this.id);
			}

			catch{
				console.log("It was dead when I came. I swear!")
			}
		} 
	}

	setNewContainments(){
		var containment = $(this.dragbar).draggable( "option", "containment" );
		var left = numeranda.ui.getPositionPx(numeranda.ui.container).left;
		var top = containment[1];
		var right = numeranda.ui.getPositionPx(numeranda.ui.container).right;
		var bottom = containment[3];

		if (this.leftWindow.size>0){
			let a = Array.from(this.leftWindow);
			var leftMax = numeranda.ui.getPositionPx(a[0].window).left;
			for (var i=1; i<this.leftWindow.size; i++){
  				if(leftMax < numeranda.ui.getPositionPx(a[i].window).left)
  					leftMax = numeranda.ui.getPositionPx(a[i].window).left;
			};
		}

		
		if (this.rightWindow.size>0){
			let a = Array.from(this.rightWindow);
			var rightMin = numeranda.ui.getPositionPx(a[0].window).right;
			for (var i=1; i<this.rightWindow.size; i++){
  				if(rightMin > numeranda.ui.getPositionPx(a[i].window).right)
  					rightMin = numeranda.ui.getPositionPx(a[i].window).right;
			};
		}
	
		
		$(this.dragbar).draggable( "option", "containment", [leftMax + left, top, rightMin + left, bottom]);
		$(this.dragbar).data('uiDraggable')._setContainment(); // nessesary to change the containment during drag
		
	}

	
	resizeWindows(delta){
		self = this;
		this.leftWindow.forEach(function (item) {
  			item.resize()
		});

		this.rightWindow.forEach(function (item) {
  			item.resize()
		});
	}

	newRightWindows(takeFromThisDragbar){
		//this.rightWindow.delete(deleteThis);
		self = this;
		takeFromThisDragbar.rightWindow.forEach(function (item) {
  			self.addRightWindow(item);
		});
		this.fitToWindows();
	}

	newLeftWindows(takeFromThisDragbar){
		//this.leftWindow.delete(deleteThis);
		self = this;
		takeFromThisDragbar.leftWindow.forEach(function (item) {
  			self.addLeftWindow(item);
		});
		this.fitToWindows();
	}


	onStop(){

		//recalculate to %
		this.dragbar.style.left = numeranda.ui.getPosition(this.dragbar).left + "%";

		var ifKillMyself = false;

		this.leftWindow.forEach(function (item) {
  			ifKillMyself += item.ifToBeRemovedByVerticalDragbar(self);
		});

		this.rightWindow.forEach(function (item) {
  			ifKillMyself += item.ifToBeRemovedByVerticalDragbar(self);
		});

		if (ifKillMyself!=0)
			numeranda.ui.removeDiv(this.id);

	}

	/*splitLeftWindowPx(wnd){
		var newDragbar = new VerticalDragbar("", "standardVerticalDragbar");
		newDragbar.dragbar.style.left = numeranda.ui.getPositionPx(wnd.window).width/2 + numeranda.ui.getPositionPx(wnd.window).left + "px";
		newDragbar.dragbar.style.top =  numeranda.ui.getPositionPx(wnd.window).top + "px"
		this.removeLeftWindow(wnd);

		newDragbar.addLeftWindow(wnd);

		var newWindow = new Window("", "standardWindow");
		this.addLeftWindow(newWindow);
		newDragbar.addRightWindow(newWindow);
		if(wnd.topDragbar!=null)
			wnd.topDragbar.addBottomWindow(newWindow);
		if(wnd.bottomDragbar!=null)
			wnd.bottomDragbar.addTopWindow(newWindow);
		newWindow.fitTheAreaBetweenDragbars();
		newDragbar.fitToWindows();

		numeranda.ui.pushWindow(newWindow);
		numeranda.ui.pushDragbar(newDragbar);

	}*/

	splitLeftWindow(wnd){
		var newDragbar = new VerticalDragbar("", "standardVerticalDragbar");
		newDragbar.setPosition(numeranda.ui.getPosition(wnd.window).width/2 + numeranda.ui.getPosition(wnd.window).left)
		this.removeLeftWindow(wnd);

		newDragbar.addLeftWindow(wnd);

		var newWindow = new Window("", "standardWindow");
		this.addLeftWindow(newWindow);
		newDragbar.addRightWindow(newWindow);
		if(wnd.topDragbar!=null)
			wnd.topDragbar.addBottomWindow(newWindow);
		if(wnd.bottomDragbar!=null)
			wnd.bottomDragbar.addTopWindow(newWindow);

		newWindow.fitTheAreaBetweenDragbars();
		newDragbar.fitToWindows();
		//this.fitToWindows();
		//numeranda.ui.makeLayout();

	}

	splitThistWindow(wnd){

		// TO DO
		// set limitations on the size while can be split still
		if(this.leftWindow.has(wnd)){
			console.log("found left " + wnd.id);
			this.splitLeftWindow(wnd);
		}

		if(this.rightWindow.has(wnd))
			console.log("found right " + wnd.id);
	}

	makeDoubleClickable(){
		var self = this;
		$(this.dragbar).dblclick(function(){
    		//alert("The paragraph was double-clicked.");
    		console.log(self.id);
    		self.splitThistWindow(Array.from(self.leftWindow)[0]);
  		});
	}

	makeDraggable(){
		var initialPosition;
		var self = this;
		$(this.dragbar).draggable({
			axis: "x",
			containment: [numeranda.ui.getPositionPx(numeranda.ui.container).left, numeranda.ui.getPositionPx(numeranda.ui.container).top, numeranda.ui.getPositionPx(numeranda.ui.container).right, numeranda.ui.getPositionPx(numeranda.ui.container).bottom],
			start: function(){
				self.setNewContainments();
				initialPosition = numeranda.ui.getPositionPx(self.dragbar).left;
			},
			//stop: function(){
			drag: function(){
				
				numeranda.ui.setIfSomeAction(true);
				var delta = numeranda.ui.getPositionPx(self.dragbar).left - initialPosition;
				self.resizeWindows(delta);
				initialPosition = numeranda.ui.getPositionPx(self.dragbar).left;

			},
			stop: function(){
				//self.onStop();
				numeranda.ui.setIfSomeAction(false);
				var delta = numeranda.ui.getPositionPx(self.dragbar).left - initialPosition;
				self.resizeWindows(delta);
				self.onStop();
			},

		});
	}
}