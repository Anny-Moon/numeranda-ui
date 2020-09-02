import {Dragbar} from './Dragbar.js';
import {Window} from './Window.js';


export class HorizontalDragbar extends Dragbar{
	constructor(id, extraClasses){
		if(extraClasses == "" || extraClasses == null)
			extraClasses = "standardHorizontalDragbar";
		super(id, extraClasses);
		this.topWindow = new Set();
		this.bottomWindow = new Set();
		this.makeDraggable();
		this.makeDoubleClickable();

	}

	addTopWindow(div){
		this.topWindow.add(div);
		div.setHeight(numeranda.ui.getPosition(this.dragbar).top);
		div.setBottomDragbar(this);
		
	}

	addBottomWindow(div){
		this.bottomWindow.add(div);
		div.setTop(numeranda.ui.getPosition(this.dragbar).top);
		div.setTopDragbar(this);
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

	setPosition(top){
		this.dragbar.style.top = top + "%";
	}

	/*fitToWindowsPx(){

		var s = new Set([...this.topWindow, ...this.bottomWindow])
		var a = Array.from(s);

		var rightMax = numeranda.ui.getPositionPx(a[0].window).right;
		for (var i=1; i<a.length; i++){
  			if(rightMax < numeranda.ui.getPositionPx(a[i].window).right)
  				rightMax = numeranda.ui.getPositionPx(a[i].window).right;
		};
		
		this.dragbar.style.width = (rightMax - numeranda.ui.getPositionPx(this.dragbar).left) + "px";

		var leftMin = numeranda.ui.getPositionPx(a[0].window).left;
		for (var i=1; i<a.length; i++){
  			if(leftMin > numeranda.ui.getPositionPx(a[i].window).left)
  				leftMin = numeranda.ui.getPositionPx(a[i].window).left;
		};

		this.dragbar.style.left = leftMin + "px";

		if(!numeranda.ui.getIfSomeAction() && numeranda.ui.getPositionPx(this.dragbar).width<numeranda.ui.MIN_WIDTH){
			try{
				numeranda.ui.removeDiv(this.id);
			}

			catch{
				console.log("It was dead when I came. I swear!")
			}
		} 

	}*/

	fitToWindows(){

		var s = new Set([...this.topWindow, ...this.bottomWindow])
		var a = Array.from(s);

		var leftMin = numeranda.ui.getPosition(a[0].window).left;
		for (var i=1; i<a.length; i++){
  			if(leftMin > numeranda.ui.getPosition(a[i].window).left)
  				leftMin = numeranda.ui.getPosition(a[i].window).left;
		};

		this.dragbar.style.left = leftMin + "%";

		var rightMax = numeranda.ui.getPosition(a[0].window).right;
		for (var i=1; i<a.length; i++){
  			if(rightMax < numeranda.ui.getPosition(a[i].window).right)
  				rightMax = numeranda.ui.getPosition(a[i].window).right;
		};
		
		this.dragbar.style.width = (rightMax - numeranda.ui.getPosition(this.dragbar).left) + "%";


		if(!numeranda.ui.getIfSomeAction() && numeranda.ui.getPosition(this.dragbar).width<numeranda.ui.MIN_WIDTH){
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
		// counts in absolute position of conteiner!
		var containment = $(this.dragbar).draggable( "option", "containment" )
		var left = containment[0];
		var top = numeranda.ui.getPositionPx(numeranda.ui.container).top;
		var right = containment[2];
		var bottom = numeranda.ui.getPositionPx(numeranda.ui.container).bottom;

		if (this.topWindow.size>0){
			let a = Array.from(this.topWindow);
			var topMax = numeranda.ui.getPositionPx(a[0].window).top;
			for (var i=1; i<this.topWindow.size; i++){
  				if(topMax < numeranda.ui.getPositionPx(a[i].window).top)
  					topMax = numeranda.ui.getPositionPx(a[i].window).top;
			};

		}

		
		if (this.bottomWindow.size>0){
			let a = Array.from(this.bottomWindow);
			var bottomMin = numeranda.ui.getPositionPx(a[0].window).bottom;
			for (var i=1; i<this.bottomWindow.size; i++){
  				if(bottomMin > numeranda.ui.getPositionPx(a[i].window).bottom)
  					bottomMin = numeranda.ui.getPositionPx(a[i].window).bottom;
			};
		}
	
		$(this.dragbar).draggable( "option", "containment", [left, topMax+top, right, bottomMin+top]);
		$(this.dragbar).data('uiDraggable')._setContainment(); // nessesary to change the containment during drag
		console.log($(this.dragbar).draggable( "option", "containment" ))
	}

	resizeWindows(){
		self = this;
		this.topWindow.forEach(function (item) {
  			//item.resizeAsLeftWindow(delta, self);
  			item.resize()
		});

		this.bottomWindow.forEach(function (item) {
  			//item.resizeAsRightWindow(delta);
  			item.resize()
		});
	}

	newTopWindows(takeFromThisDragbar){
		//this.topWindow.delete(deleteThis);
		self = this;
		console.log(takeFromThisDragbar.id + " take from this ")
		takeFromThisDragbar.topWindow.forEach(function (item) {
  			self.addTopWindow(item);
  			console.log(self.id + " topw " + item.id)
		});
		
		this.fitToWindows();
	}

	newBottomWindows(takeFromThisDragbar){
		//this.bottomWindow.delete(deleteThis);
		self = this;
		takeFromThisDragbar.bottomWindow.forEach(function (item) {
  			self.addBottomWindow(item);

		});
		this.fitToWindows();
	}

	onStop(){
		//recalculate to %
		this.dragbar.style.top = numeranda.ui.getPosition(this.dragbar).top + "%";

		var ifKillMyself = false;

		this.topWindow.forEach(function (item) {
  			ifKillMyself += item.ifToBeRemovedByHorizontalDragbar(self);
		});

		this.bottomWindow.forEach(function (item) {
  			ifKillMyself += item.ifToBeRemovedByHorizontalDragbar(self);
		});
		//console.log(ifKillMyself)
		
		if (ifKillMyself!=0)
			numeranda.ui.removeDiv(this.id);

	}
	/*splitTopWindowPx(wnd){
		var newDragbar = new HorizontalDragbar("", "standardHorizontalDragbar");
		newDragbar.dragbar.style.top = numeranda.ui.getPositionPx(wnd.window).height/2 + numeranda.ui.getPositionPx(wnd.window).top + "px";
		newDragbar.dragbar.style.left =  numeranda.ui.getPositionPx(wnd.window).left + "px"
		this.removeTopWindow(wnd);

		newDragbar.addTopWindow(wnd);

		var newWindow = new Window("", "standardWindow");
		this.addTopWindow(newWindow);
		newDragbar.addBottomWindow(newWindow);
		if(wnd.leftDragbar!=null)
			wnd.leftDragbar.addRightWindow(newWindow);
		if(wnd.rightDragbar!=null)
			wnd.rightDragbar.addLeftWindow(newWindow);
		newWindow.fitTheAreaBetweenDragbars();
		newDragbar.fitToWindows();

		numeranda.ui.pushWindow(newWindow);
		numeranda.ui.pushDragbar(newDragbar);

	}*/

	splitTopWindow(wnd){
		var newDragbar = new HorizontalDragbar("", "standardHorizontalDragbar");
		newDragbar.setPosition(numeranda.ui.getPosition(wnd.window).height/2 + numeranda.ui.getPosition(wnd.window).top )
		this.removeTopWindow(wnd);

		newDragbar.addTopWindow(wnd);

		var newWindow = new Window("", "standardWindow");
		this.addTopWindow(newWindow);
		newDragbar.addBottomWindow(newWindow);
		if(wnd.leftDragbar!=null)
			wnd.leftDragbar.addRightWindow(newWindow);
		if(wnd.rightDragbar!=null)
			wnd.rightDragbar.addLeftWindow(newWindow);
		newWindow.fitTheAreaBetweenDragbars();
		newDragbar.fitToWindows();

		//numeranda.ui.pushWindow(newWindow);
		//numeranda.ui.pushDragbar(newDragbar);

	}

	splitThistWindow(wnd){
		if(this.topWindow.has(wnd)){
			console.log("found top " + wnd.id);
			this.splitTopWindow(wnd);
		}

		if(this.bottomWindow.has(wnd))
			console.log("found bottom " + wnd.id);
	}

	makeDoubleClickable(){
		var self = this;
		$(this.dragbar).dblclick(function(){
    		console.log(self.id);
    		self.splitThistWindow(Array.from(self.topWindow)[0]);
  		});
	}

	makeDraggable(){
		var initialPosition;
		var self = this;
		$(this.dragbar).draggable({
			axis: "y",
			containment: [numeranda.ui.getPositionPx(numeranda.ui.container).left, numeranda.ui.getPositionPx(numeranda.ui.container).top, numeranda.ui.getPositionPx(numeranda.ui.container).right, numeranda.ui.getPositionPx(numeranda.ui.container).bottom],
			start: function(){
				self.setNewContainments();
				console.log($(self.dragbar).draggable( "option", "containment" ));
			},
			//stop: function(){
			drag: function(){
				numeranda.ui.setIfSomeAction(true);
				self.resizeWindows();
			},
			stop: function(){
				numeranda.ui.setIfSomeAction(false);
				self.resizeWindows();
				self.onStop();
			},

		});
	}
}