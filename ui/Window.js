export class Window{
	constructor(id, extraClasses){
		if(id=="" || id == null){
			id = "window" + numeranda.ui.getWindowCounter();
		}
		if(extraClasses == "" || extraClasses == null)
			extraClasses = "standardWindow";
		this.id = id;
		this.window = numeranda.ui.createDiv(id, extraClasses);
		this.rightNeighbor = [];
		this.bottomNeighbor = null;
		const color = Math.floor(Math.random()*16777215).toString(16);
		this.window.style.background = "#" + color;
		this.window.style.width = "100%";
		this.window.style.height = "100%";

		this.leftDragbar = null;
		this.rightDragbar = null;
		this.topDragbar = null;
		this.bottomDragbar = null;
		numeranda.ui.windowCounterPlusPlus();

		numeranda.ui.pushWindow(this);
		
	}

	setRightDragbar(div){
		this.rightDragbar = div;
	}

	setLeftDragbar(div){
		this.leftDragbar = div;
	}

	setTopDragbar(div){
		this.topDragbar = div;
	}

	setBottomDragbar(div){
		this.bottomDragbar = div;
	}


	getSize(){
		var positionInfo = this.window.getBoundingClientRect();
		return positionInfo
	}


	ifToBeRemovedByVerticalDragbar(owner){
		if (numeranda.ui.getPositionPx(this.window).width<numeranda.ui.MIN_WIDTH){
			if(this.leftDragbar!=null){
				this.leftDragbar.newRightWindows(owner);
				this.leftDragbar.newLeftWindows(owner);
			}

			if(this.rightDragbar!=null){
				this.rightDragbar.newRightWindows(owner);
				this.rightDragbar.newLeftWindows(owner);
			}
			
			//numeranda.ui.removeDiv(owner.id);
			this.sayGoodbyeToFriends();
			console.log(this.id + " will say to kill " + owner.id);	
			numeranda.ui.removeDiv(this.id);
			
			return true;
		}
		return false;
	}

	
	ifToBeRemovedByHorizontalDragbar(owner){
		if (numeranda.ui.getPositionPx(this.window).height<numeranda.ui.MIN_HEIGHT){
			if(this.topDragbar!=null){
				this.topDragbar.newBottomWindows(owner);
				this.topDragbar.newTopWindows(owner);
			}
			if(this.bottomDragbar!=null){
				this.bottomDragbar.newBottomWindows(owner);
				this.bottomDragbar.newTopWindows(owner);
			}

			//numeranda.ui.removeDiv(owner.id);
			this.sayGoodbyeToFriends();
			console.log(this.id + " will say to kill " + owner.id);
			numeranda.ui.removeDiv(this.id);
			return true;
		}
		return false;
	}

	sayGoodbyeToFriends(){;
		if(this.leftDragbar!=null)
			this.leftDragbar.removeRightWindow(this);

		console.log(this.id + "rightDB id: if any then next line");
		if(this.rightDragbar!=null){
			console.log( "rightDB id: "+ this.rightDragbar.id);
			this.rightDragbar.removeLeftWindow(this);
		}

		if(this.topDragbar!=null)
			this.topDragbar.removeBottomWindow(this);

		if(this.bottomDragbar!=null)
			this.bottomDragbar.removeTopWindow(this);

		console.log(this.id + ": I will kill myself")
	}

	fitTheAreaBetweenDragbars(){
		var top = 0;
		var left = 0;
		//var height = numeranda.ui.getPositionPx(numeranda.ui.container).height;
		//var width = numeranda.ui.getPositionPx(numeranda.ui.container).width;

		var height = numeranda.ui.getPosition(numeranda.ui.container).height;
		var width = numeranda.ui.getPosition(numeranda.ui.container).width;		
		
		if(this.topDragbar!=null){
			//top = numeranda.ui.getPositionPx(this.topDragbar.dragbar).top;
			top = numeranda.ui.getPosition(this.topDragbar.dragbar).top;
			height = height - top;
		}

		if(this.bottomDragbar!=null){
			//height = numeranda.ui.getPositionPx(this.bottomDragbar.dragbar).top - top;
			height = numeranda.ui.getPosition(this.bottomDragbar.dragbar).top - top;
		}

		if(this.leftDragbar!=null){
			//left = numeranda.ui.getPositionPx(this.leftDragbar.dragbar).left
			left = numeranda.ui.getPosition(this.leftDragbar.dragbar).left
			width = width - left;
		}

		if(this.rightDragbar!=null){
			width = numeranda.ui.getPosition(this.rightDragbar.dragbar).left - left;
			//width = numeranda.ui.getPositionPx(this.rightDragbar.dragbar).left - left;
		}
		/*
		this.window.style.left = left + "px";
		this.window.style.width = width + "px";
		this.window.style.top = top + "px";
		this.window.style.height = height + "px";
		*/
		this.window.style.left = left + "%";
		this.window.style.width = width + "%";
		this.window.style.top = top + "%";
		this.window.style.height = height + "%";


	}

	resize(){
		this.fitTheAreaBetweenDragbars();
		if(this.bottomDragbar!=null){
			this.bottomDragbar.fitToWindows()
		}

		if(this.topDragbar!=null){
			this.topDragbar.fitToWindows()
		}

		if(this.leftDragbar!=null){
			this.leftDragbar.fitToWindows()
		}

		if(this.rightDragbar!=null){
			this.rightDragbar.fitToWindows()
		}

	}

	setRightNeighbor(div){
		this.rightNeighbor.push(div);
	}

	setWidth(value){
		this.window.style.width = (value - numeranda.ui.getPosition(this.window).left)+ "%";

	}

	setLeft(value){
		this.window.style.left = value + "%";

	}

	setHeight(value){
		this.window.style.height = (value - numeranda.ui.getPosition(this.window).top)+ "%";
	}

	setTop(value){
		this.window.style.top = value + "%";
	}

}