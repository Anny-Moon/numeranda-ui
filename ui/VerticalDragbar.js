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
		this.rightPx=0;
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

	setPosition({left:left, right:right}){
		if(left!=null){
			this.dragbar.style.left = left;
		}

		if(right!=null){

			if(right.charAt(right.length-1)=="%"){
				this.dragbar.style.left = 100-right;
			}

			else if(right.charAt(right.length-1)=="x"){
				this.rightPx = right.substring(0, right.length - 2);
				let containerPosition = this.master.container.getBoundingClientRect();
				let left = (containerPosition.width - this.rightPx)/containerPosition.width * 100;
				this.dragbar.style.left = left + "%";
			}
		}

		this.dragbar.style.top = "0%"
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
		
		var topMin = this.master.getPosition(a[0].window).top;
		
		for (var i=1; i<a.length; i++){
  			if(topMin > this.master.getPosition(a[i].window).top)
  				topMin = this.master.getPosition(a[i].window).top;
		};

		this.dragbar.style.top = topMin + "%";

		var bottomMax = this.master.getPosition(a[0].window).bottom;
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

		// for Safari
		this.dragbar.style.position = "absolute";
	}

	fitToWindowsRescale(){

		var s = new Set([...this.leftWindow, ...this.rightWindow])
		var a = Array.from(s);
		
		var topMin = this.master.getPosition(a[0].window).top;
		
		for (var i=1; i<a.length; i++){
  			if(topMin > this.master.getPosition(a[i].window).top)
  				topMin = this.master.getPosition(a[i].window).top;
		};

		this.dragbar.style.top = topMin + "%";

		var bottomMax = this.master.getPosition(a[0].window).bottom;
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

		if(this.rightPx!=0){
			let containerPosition = this.master.container.getBoundingClientRect();
			let left = (containerPosition.width - this.rightPx)/containerPosition.width * 100;
			this.dragbar.style.left = left + "%";
		}

		// for Safari
		this.dragbar.style.position = "absolute";
	}

	setNewContainments(){
		// counts in absolute position of conteiner!
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

	resizeWindows(){
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
			if(Master.getPositionPx(item.window).width>self.master.MIN_WIDTH)
  				self.addRightWindow(item);
			
		});
		this.fitToWindows();
	}

	newLeftWindows(takeFromThisDragbar){
		//this.leftWindow.delete(deleteThis);
		self = this;
		takeFromThisDragbar.leftWindow.forEach(function (item) {
			if(Master.getPositionPx(item.window).width>self.master.MIN_WIDTH)
  				self.addLeftWindow(item);
			
		});
		this.fitToWindows();
	}

	onStop(){
		//recalculate to %
		this.dragbar.style.left = this.master.getPosition(this.dragbar).left + "%";

		var ifKillMyself = false;

		// |	|
		//	  <-|
		// |	|
		
		var leftDragbars = new Set();
		this.leftWindow.forEach(function (item) {
			const leftDragbar = item.leftDragbar;
  			const flag = item.ifToBeRemovedByVerticalDragbar(self);
  			if(flag===true && leftDragbar!=null){
  				leftDragbars.add(leftDragbar);
  			}
  			ifKillMyself += flag;
		});

		if(leftDragbars.size>1){;
			var array = Array.from(leftDragbars);
			for(let i=1; i<array.length; i++){
				array[i].leftWindow.forEach(element=> array[0].addLeftWindow(element))
				array[i].rightWindow.forEach(element=> array[0].addRightWindow(element))
				this.master.removeDiv(array[i].id);
			}
		}
		
		// |	|
		// |->
		// |	|

		var rightDragbars = new Set();
		this.rightWindow.forEach(function (item) {
			const rightDragbar = item.rightDragbar;
  			const flag = item.ifToBeRemovedByVerticalDragbar(self);
  			if(flag===true && rightDragbar!=null){
  				rightDragbars.add(rightDragbar);
  			}
  			ifKillMyself += flag;
		});

		if(rightDragbars.size>1){;
			var array = Array.from(rightDragbars);
			for(let i=1; i<array.length; i++){
				array[i].rightWindow.forEach(element=> array[0].addRightWindow(element))
				array[i].leftWindow.forEach(element=> array[0].addLeftWindow(element))
				this.master.removeDiv(array[i].id);
			}
		}

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
		var newDragbar = this.master.createDragbar({type:"vertical"});
		const position = this.master.getPosition(wnd.window).width/2 + this.master.getPosition(wnd.window).left;
		newDragbar.setPosition({"left":position + "%"});
		
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
		wnd.fitTheAreaBetweenDragbars();
		newDragbar.fitToWindows();

	}

	splitRightWindow(wnd){
		var newDragbar = this.master.createDragbar({type:"vertical"});
		const position = this.master.getPosition(wnd.window).width/2 + this.master.getPosition(wnd.window).left;
		newDragbar.setPosition({"left":position + "%"});
		
		this.removeRightWindow(wnd);

		newDragbar.addRightWindow(wnd);

		var newWindow = new Window(this.master);
		this.addRightWindow(newWindow);
		newDragbar.addLeftWindow(newWindow);
		if(wnd.topDragbar!=null)
			wnd.topDragbar.addBottomWindow(newWindow);
		if(wnd.bottomDragbar!=null)
			wnd.bottomDragbar.addTopWindow(newWindow);

		newWindow.fitTheAreaBetweenDragbars();
		wnd.fitTheAreaBetweenDragbars();
		newDragbar.fitToWindows();
	}

	splitThistWindow(wnd){
		// TO DO
		// set limitations on the size while can be split still

		if(!wnd.isSplitAllowed)
			return;
		if(this.leftWindow.has(wnd)){
			console.log("Found left " + wnd.id);
			this.splitLeftWindow(wnd);
		}

		if(this.rightWindow.has(wnd)){
			console.log("Found right " + wnd.id);
			this.splitRightWindow(wnd);
		}
	}

	makeDoubleClickable(){
		var self = this;
		$(this.dragbar).dblclick(function(){
    		//self.splitThistWindow(Array.from(self.leftWindow)[0]);
    		self.makeMyWindowsHover();
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
			},
			drag: function(){
				self.master.setIfSomeAction(true);
				self.resizeWindows();
			},
			stop: function(){
				self.master.setIfSomeAction(false);
				self.resizeWindows();
				self.onStop();
			},

		});
	}

	makeMyWindowsHover(){
		var self = this;
		this.leftWindow.forEach(element => element.hover(self, true));
		this.rightWindow.forEach(element => element.hover(self, true));
	}

	makeMyWindowsUnhover(){
		var self = this;
		this.leftWindow.forEach(element => element.hover(self, false));
		this.rightWindow.forEach(element => element.hover(self, false));
	}
}