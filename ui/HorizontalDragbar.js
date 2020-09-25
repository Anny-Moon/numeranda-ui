import {Dragbar} from './Dragbar.js';
import {Window} from './Window.js';
import {Master} from './Master.js';


export class HorizontalDragbar extends Dragbar{
	constructor(master, id, extraClasses){
		if(extraClasses == "" || extraClasses == null)
			extraClasses = "standardHorizontalDragbar";
		super(master, id, extraClasses);
		this.topWindow = new Set();
		this.bottomWindow = new Set();
		this.makeDraggable();
		this.makeDoubleClickable();
		this.bottomPx = 0;
	}

	addOneTopWindow(div){
		this.topWindow.add(div);
		div.setHeight(this.master.getPosition(this.dragbar).top);
		div.setBottomDragbar(this);
		
	}
	addTopWindow(div){
		var self = this;
		if(Array.isArray(div))
			div.forEach(element => self.addOneTopWindow(element));

		else
			self.addOneTopWindow(div);
	}

	addOneBottomWindow(div){
		this.bottomWindow.add(div);
		div.setTop(this.master.getPosition(this.dragbar).top);
		div.setTopDragbar(this);
	}
	addBottomWindow(div){
		var self = this;
		if(Array.isArray(div))
			div.forEach(element => self.addOneBottomWindow(element));

		else
			self.addOneBottomWindow(div);
	}

	removeTopWindow(div){
		console.log(this.id + ": I will remove from my neighbours " + div.id);
		this.topWindow.delete(div);
	}

	removeBottomWindow(div){
		console.log(this.id + ": I will remove from my neighbours " + div.id);
		this.bottomWindow.delete(div);
	}

	setWidthPx(value){
		this.dragbar.style.width = value + "px";
	}

	setPosition({top:top, bottom:bottom}){
		if(top!=null)
			this.dragbar.style.top = top ;
		

		if(bottom!=null){

			if(bottom.charAt(bottom.length-1)=="%"){
				this.dragbar.style.top = 100-bottom;
			}

			else if(bottom.charAt(bottom.length-1)=="x"){
				this.bottomPx = bottom.substring(0, bottom.length - 2);
				let containerPosition = this.master.container.getBoundingClientRect();
				let top = (containerPosition.height - this.bottomPx)/containerPosition.height * 100
				this.dragbar.style.top = top + "%";
			}
		}

		this.dragbar.style.left = "0%"
	}

	/*fitToWindowsPx(){

		var s = new Set([...this.topWindow, ...this.bottomWindow])
		var a = Array.from(s);
		var rightMax = Master.getPositionPx(a[0].window).right;

		for (var i=1; i<a.length; i++){
  			if(rightMax < Master.getPositionPx(a[i].window).right)
  				rightMax = Master.getPositionPx(a[i].window).right;
		};
		
		this.dragbar.style.width = (rightMax - Master.getPositionPx(this.dragbar).left) + "px";

		var leftMin = Master.getPositionPx(a[0].window).left;
		for (var i=1; i<a.length; i++){
  			if(leftMin > Master.getPositionPx(a[i].window).left)
  				leftMin = Master.getPositionPx(a[i].window).left;
		};

		this.dragbar.style.left = leftMin + "px";

		if(!Master.getIfSomeAction() && Master.getPositionPx(this.dragbar).width<this.master.MIN_WIDTH){
			try{
				this.master.removeDiv(this.id);
			}

			catch{
				console.log("It was dead when I came. I swear!")
			}
		} 

	}*/

	fitToWindows(){

		var s = new Set([...this.topWindow, ...this.bottomWindow])
		var a = Array.from(s);

		var leftMin = this.master.getPosition(a[0].window).left;

		for (var i=1; i<a.length; i++){
  			if(leftMin > this.master.getPosition(a[i].window).left)
  				leftMin = this.master.getPosition(a[i].window).left;
		};

		this.dragbar.style.left = leftMin + "%";

		var rightMax = this.master.getPosition(a[0].window).right;
		for (var i=1; i<a.length; i++){
  			if(rightMax < this.master.getPosition(a[i].window).right)
  				rightMax = this.master.getPosition(a[i].window).right;
		};
		
		this.dragbar.style.width = (rightMax - this.master.getPosition(this.dragbar).left) + "%";

		if(!this.master.getIfSomeAction() && this.master.getPosition(this.dragbar).width<this.master.MIN_WIDTH){
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

		var s = new Set([...this.topWindow, ...this.bottomWindow])
		var a = Array.from(s);

		var leftMin = this.master.getPosition(a[0].window).left;

		for (var i=1; i<a.length; i++){
  			if(leftMin > this.master.getPosition(a[i].window).left)
  				leftMin = this.master.getPosition(a[i].window).left;
		};

		this.dragbar.style.left = leftMin + "%";

		var rightMax = this.master.getPosition(a[0].window).right;
		for (var i=1; i<a.length; i++){
  			if(rightMax < this.master.getPosition(a[i].window).right)
  				rightMax = this.master.getPosition(a[i].window).right;
		};
		
		this.dragbar.style.width = (rightMax - this.master.getPosition(this.dragbar).left) + "%";

		if(!this.master.getIfSomeAction() && this.master.getPosition(this.dragbar).width<this.master.MIN_WIDTH){
			try{
				console.log(this.id + " became too thin, so will be deleted.")
				this.master.removeDiv(this.id);
			}

			catch{
				console.log("It was dead when I came. I swear!")
			}
		}

		if(this.bottomPx!=0){
			let containerPosition = this.master.container.getBoundingClientRect();
			let top = (containerPosition.height - this.bottomPx)/containerPosition.height * 100;
			this.dragbar.style.top = top + "%";
		}

		// for Safari
		this.dragbar.style.position = "absolute";
	}

	setNewContainments(){
		// counts in absolute position of conteiner!
		var containment = $(this.dragbar).draggable( "option", "containment" )
		var left = containment[0];
		var top = Master.getPositionPx(this.master.container).top;
		var right = containment[2];
		var bottom = Master.getPositionPx(this.master.container).bottom;

		if (this.topWindow.size>0){
			let a = Array.from(this.topWindow);
			var topMax = Master.getPositionPx(a[0].window).top;
			for (var i=1; i<this.topWindow.size; i++){
  				if(topMax < Master.getPositionPx(a[i].window).top)
  					topMax = Master.getPositionPx(a[i].window).top;
			};
		}
		
		if (this.bottomWindow.size>0){
			let a = Array.from(this.bottomWindow);
			var bottomMin = Master.getPositionPx(a[0].window).bottom;
			for (var i=1; i<this.bottomWindow.size; i++){
  				if(bottomMin > Master.getPositionPx(a[i].window).bottom)
  					bottomMin = Master.getPositionPx(a[i].window).bottom;
			};
		}
	
		$(this.dragbar).draggable( "option", "containment", [left, topMax+top, right, bottomMin+top]);
		$(this.dragbar).data('uiDraggable')._setContainment(); // nessesary to change the containment during drag
	}

	resizeWindows(){
		self = this;
		this.topWindow.forEach(function (item) {
  			item.resize()
		});

		this.bottomWindow.forEach(function (item) {
  			item.resize()
		});
	}

	newTopWindows(takeFromThisDragbar){
		//this.topWindow.delete(deleteThis);
		self = this;
		takeFromThisDragbar.topWindow.forEach(function (item) {
			if(Master.getPositionPx(item.window).height>self.master.MIN_HEIGHT)
  				self.addTopWindow(item);
		});
		this.fitToWindows();
	}

	newBottomWindows(takeFromThisDragbar){
		//this.bottomWindow.delete(deleteThis);
		self = this;
		takeFromThisDragbar.bottomWindow.forEach(function (item) {
			if(Master.getPositionPx(item.window).height>self.master.MIN_HEIGHT)
  				self.addBottomWindow(item);
		});
		this.fitToWindows();
	}

	onStop(){
		var self = this;
		//recalculate to %
		this.dragbar.style.top = this.master.getPosition(this.dragbar).top + "%";

		var ifKillMyself = false;

		// |	|
		//	  <-|
		// |	|

		var topDragbars = new Set();
		this.topWindow.forEach(function (item) {
			const topDragbar = item.topDragbar;
  			const flag = item.ifToBeRemovedByHorizontalDragbar(self);
  			if(flag===true && topDragbar!=null){
  				topDragbars.add(topDragbar);
  			}
  			ifKillMyself += flag;
		});

		if(topDragbars.size>1){;
			var array = Array.from(topDragbars);
			for(let i=1; i<array.length; i++){
				array[i].topWindow.forEach(element=> array[0].addTopWindow(element))
				array[i].bottomWindow.forEach(element=> array[0].addBottomWindow(element))
				this.master.removeDiv(array[i].id);
			}
		}

		// |	|
		// |->
		// |	|

		var bottomDragbars = new Set();
		this.bottomWindow.forEach(function (item) {
			const bottomDragbar = item.bottomDragbar;
  			const flag = item.ifToBeRemovedByHorizontalDragbar(self);
  			if(flag===true && bottomDragbar!=null){
  				bottomDragbars.add(bottomDragbar);
  			}
  			ifKillMyself += flag;
		});

		if(bottomDragbars.size>1){;
			var array = Array.from(bottomDragbars);
			for(let i=1; i<array.length; i++){
				array[i].bottomWindow.forEach(element=> array[0].addBottomWindow(element))
				array[i].topWindow.forEach(element=> array[0].addTopWindow(element))
				this.master.removeDiv(array[i].id);
			}
		}

		if (ifKillMyself!=0)
			this.master.removeDiv(this.id);
	}

	/*splitTopWindowPx(wnd){
		var newDragbar = new HorizontalDragbar(this.master);
		newDragbar.dragbar.style.top = Master.getPositionPx(wnd.window).height/2 + Master.getPositionPx(wnd.window).top + "px";
		newDragbar.dragbar.style.left =  Master.getPositionPx(wnd.window).left + "px"
		this.removeTopWindow(wnd);

		newDragbar.addTopWindow(wnd);

		var newWindow = new Window(this.master);
		this.addTopWindow(newWindow);
		newDragbar.addBottomWindow(newWindow);
		if(wnd.leftDragbar!=null)
			wnd.leftDragbar.addRightWindow(newWindow);
		if(wnd.rightDragbar!=null)
			wnd.rightDragbar.addLeftWindow(newWindow);
		newWindow.fitTheAreaBetweenDragbars();
		newDragbar.fitToWindows();

	}*/

	splitTopWindow(wnd){
		var newDragbar = this.master.createDragbar({type:"horizontal"});
		const position = this.master.getPosition(wnd.window).height/2 + this.master.getPosition(wnd.window).top;
		newDragbar.setPosition({"top":position + "%"})
		
		this.removeTopWindow(wnd);

		newDragbar.addTopWindow(wnd);

		var newWindow = this.master.createWindow({});
		this.addTopWindow(newWindow);
		newDragbar.addBottomWindow(newWindow);
		if(wnd.leftDragbar!=null)
			wnd.leftDragbar.addRightWindow(newWindow);
		if(wnd.rightDragbar!=null)
			wnd.rightDragbar.addLeftWindow(newWindow);

		newWindow.fitTheAreaBetweenDragbars();
		wnd.fitTheAreaBetweenDragbars();
		newDragbar.fitToWindows();

	}

	splitBottomWindow(wnd){
		var newDragbar = this.master.createDragbar({type:"horizontal"});
		const position = this.master.getPosition(wnd.window).height/2 + this.master.getPosition(wnd.window).top;
		newDragbar.setPosition({"top":position + "%"})
		
		this.removeBottomWindow(wnd);

		newDragbar.addBottomWindow(wnd);

		var newWindow = this.master.createWindow({});
		this.addBottomWindow(newWindow);
		newDragbar.addTopWindow(newWindow);
		if(wnd.leftDragbar!=null)
			wnd.leftDragbar.addRightWindow(newWindow);
		if(wnd.rightDragbar!=null)
			wnd.rightDragbar.addLeftWindow(newWindow);

		newWindow.fitTheAreaBetweenDragbars();
		wnd.fitTheAreaBetweenDragbars();
		newDragbar.fitToWindows();
	}

	splitThistWindow(wnd){
		// TO DO
		// set limitations on the size while can be split still

		if(!wnd.isSplitAllowed)
			return;
		
		if(this.topWindow.has(wnd)){
			console.log("found top " + wnd.id);
			this.splitTopWindow(wnd);
		}

		if(this.bottomWindow.has(wnd)){
			console.log("found bottom " + wnd.id);
			this.splitBottomWindow(wnd);
		}
	}

	makeDoubleClickable(){
		var self = this;
		$(this.dragbar).dblclick(function(){
    		//self.splitThistWindow(Array.from(self.topWindow)[0]);
    		self.makeMyWindowsHover();
  		});
	}

	makeDraggable(){
		var initialPosition;
		var self = this;
		$(this.dragbar).draggable({
			axis: "y",
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
		this.topWindow.forEach(element => element.hover(self, true));
		this.bottomWindow.forEach(element => element.hover(self, true));
	}

	makeMyWindowsUnhover(){
		var self = this;
		this.topWindow.forEach(element => element.hover(self, false));
		this.bottomWindow.forEach(element => element.hover(self, false));
	}
}