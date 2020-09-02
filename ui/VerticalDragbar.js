import {Dragbar} from './Dragbar.js';
import {Window} from './Window.js';
import {Master} from './Master.js';


export class VerticalDragbar extends Dragbar{
	constructor(master, id, extraClasses){
		if(extraClasses == "" || extraClasses == null)
			extraClasses = "standardVerticalDragbar";
		super(master, id, extraClasses);
		this.leftWindow = new Set();
		this.rightWindow = new Set();
		this.makeDraggable();
		this.makeDoubleClickable();
		
	}

	addLeftWindow(div){
		this.leftWindow.add(div);
		div.setWidth(this.master.getPosition(this.dragbar).left);
		div.setRightDragbar(this);
		
	}

	addRightWindow(div){
		this.rightWindow.add(div);
		div.setLeft(this.master.getPosition(this.dragbar).left);
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
		var bottomMax = Master.getPositionPx(a[0].window).bottom;

		for (var i=1; i<a.length; i++){
  			if(bottomMax < Master.getPositionPx(a[i].window).bottom)
  				bottomMax = Master.getPositionPx(a[i].window).bottom;
		};
		
		this.dragbar.style.height = (bottomMax - Master.getPositionPx(this.dragbar).top) + "px";

		var topMin = Master.getPositionPx(a[0].window).top;
		for (var i=1; i<a.length; i++){
  			if(topMin > Master.getPositionPx(a[i].window).top)
  				topMin = Master.getPositionPx(a[i].window).top;
		};

		this.dragbar.style.top = topMin + "px";

		if(!this.master.getIfSomeAction() && Master.getPositionPx(this.dragbar).height<this.master.MIN_HEIGHT){
			try{
				this.master.removeDiv(this.id);
			}

			catch{
				console.log("It was dead when I came. I swear!")
			}
		} 

	
	}*/

	fitToWindows(){

		var s = new Set([...this.leftWindow, ...this.rightWindow])
		var a = Array.from(s);
		var bottomMax = this.master.getPosition(a[0].window).bottom;

		
		var topMin = this.master.getPosition(a[0].window).top;
		for (var i=1; i<a.length; i++){
  			if(topMin > this.master.getPosition(a[i].window).top)
  				topMin = this.master.getPosition(a[i].window).top;
		};

		this.dragbar.style.top = topMin + "%";

		for (var i=1; i<a.length; i++){
  			if(bottomMax < this.master.getPosition(a[i].window).bottom)
  				bottomMax = this.master.getPosition(a[i].window).bottom;
		};
		
		this.dragbar.style.height = (bottomMax - this.master.getPosition(this.dragbar).top) + "%";


		if(!this.master.getIfSomeAction() && this.master.getPosition(this.dragbar).height<this.master.MIN_HEIGHT){
			try{
				console.log(this.id + " became too thin, so will be deleted.")
				this.master.removeDiv(this.id);
			}

			catch{
				console.log("It was dead when I came. I swear!")
			}
		} 
	}

	setNewContainments(){
		var containment = $(this.dragbar).draggable( "option", "containment" );
		var left = Master.getPositionPx(this.master.container).left;
		var top = containment[1];
		var right = Master.getPositionPx(this.master.container).right;
		var bottom = containment[3];

		if (this.leftWindow.size>0){
			let a = Array.from(this.leftWindow);
			var leftMax = Master.getPositionPx(a[0].window).left;
			for (var i=1; i<this.leftWindow.size; i++){
  				if(leftMax < Master.getPositionPx(a[i].window).left)
  					leftMax = Master.getPositionPx(a[i].window).left;
			};
		}

		
		if (this.rightWindow.size>0){
			let a = Array.from(this.rightWindow);
			var rightMin = Master.getPositionPx(a[0].window).right;
			for (var i=1; i<this.rightWindow.size; i++){
  				if(rightMin > Master.getPositionPx(a[i].window).right)
  					rightMin = Master.getPositionPx(a[i].window).right;
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
		this.dragbar.style.left = this.master.getPosition(this.dragbar).left + "%";

		var ifKillMyself = false;

		this.leftWindow.forEach(function (item) {
  			ifKillMyself += item.ifToBeRemovedByVerticalDragbar(self);
		});

		this.rightWindow.forEach(function (item) {
  			ifKillMyself += item.ifToBeRemovedByVerticalDragbar(self);
		});

		if (ifKillMyself!=0)
			this.master.removeDiv(this.id);

	}

	/*splitLeftWindowPx(wnd){
		var newDragbar = new VerticalDragbar(this.master);
		newDragbar.dragbar.style.left = Master.getPositionPx(wnd.window).width/2 + Master.getPositionPx(wnd.window).left + "px";
		newDragbar.dragbar.style.top =  Master.getPositionPx(wnd.window).top + "px"
		this.removeLeftWindow(wnd);

		newDragbar.addLeftWindow(wnd);

		var newWindow = new Window(this.master);
		this.addLeftWindow(newWindow);
		newDragbar.addRightWindow(newWindow);
		if(wnd.topDragbar!=null)
			wnd.topDragbar.addBottomWindow(newWindow);
		if(wnd.bottomDragbar!=null)
			wnd.bottomDragbar.addTopWindow(newWindow);
		newWindow.fitTheAreaBetweenDragbars();
		newDragbar.fitToWindows();

	}*/

	splitLeftWindow(wnd){
		var newDragbar = new VerticalDragbar(this.master);
		newDragbar.setPosition(this.master.getPosition(wnd.window).width/2 + this.master.getPosition(wnd.window).left)
		this.removeLeftWindow(wnd);

		newDragbar.addLeftWindow(wnd);

		var newWindow = new Window(this.master);
		this.addLeftWindow(newWindow);
		newDragbar.addRightWindow(newWindow);
		if(wnd.topDragbar!=null)
			wnd.topDragbar.addBottomWindow(newWindow);
		if(wnd.bottomDragbar!=null)
			wnd.bottomDragbar.addTopWindow(newWindow);

		newWindow.fitTheAreaBetweenDragbars();
		newDragbar.fitToWindows();

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
			containment: [Master.getPositionPx(this.master.container).left, Master.getPositionPx(this.master.container).top, Master.getPositionPx(this.master.container).right, Master.getPositionPx(this.master.container).bottom],
			start: function(){
				self.setNewContainments();
				initialPosition = Master.getPositionPx(self.dragbar).left;
			},
			//stop: function(){
			drag: function(){
				
				self.master.setIfSomeAction(true);
				self.resizeWindows();

			},
			stop: function(){
				//self.onStop();
				self.master.setIfSomeAction(false);
				self.resizeWindows();
				self.onStop();
			},

		});
	}
}