import {Master} from './Master.js';
import {Menu} from './Menu.js';

export class Window{
	constructor(master, id, extraClasses){
		this.master = master;
		if(id=="" || id == null){
			id = "window" + this.master.getWindowCounter();
		}
		if(extraClasses == "" || extraClasses == null)
			extraClasses = "standardWindow";
		this.id = id + "_container";
		this.window = this.master.createDiv(this.id, extraClasses);
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
		this.master.windowCounterPlusPlus();

		this.master.pushWindow(this);

		this.button = new Menu(this);
		this.ifShowButton = true;
		this.updateMenu();

		this.childWindow = this.createChildWindow(id);
		this.isSplitAllowed = true;
		
	}

	allowSplit(flag){
		this.isSplitAllowed = flag;
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
		if (Master.getPositionPx(this.window).width<this.master.MIN_WIDTH){
			
			if(this.leftDragbar!=null && this.leftDragbar!=owner){
				this.leftDragbar.newRightWindows(owner);
				this.leftDragbar.newLeftWindows(owner);
			}

			if(this.rightDragbar!=null && this.rightDragbar!=owner){
				this.rightDragbar.newLeftWindows(owner);
				this.rightDragbar.newRightWindows(owner);
			}
			
			this.sayGoodbyeToFriends();
			console.log(this.id + " will say to kill " + owner.id);	
			this.master.removeDiv(this.id);
			
			return true;
		}
		return false;
	}

	
	ifToBeRemovedByHorizontalDragbar(owner){
		if (Master.getPositionPx(this.window).height<this.master.MIN_HEIGHT){
			if(this.topDragbar!=null){
				this.topDragbar.newBottomWindows(owner);
				this.topDragbar.newTopWindows(owner);
			}
			if(this.bottomDragbar!=null){
				this.bottomDragbar.newBottomWindows(owner);
				this.bottomDragbar.newTopWindows(owner);
			}

			//this.master.removeDiv(owner.id);
			this.sayGoodbyeToFriends();
			console.log(this.id + " will say to kill " + owner.id);
			this.master.removeDiv(this.id);
			return true;
		}
		return false;
	}

	sayGoodbyeToFriends(){;
		if(this.leftDragbar!=null)
			this.leftDragbar.removeRightWindow(this);

		if(this.rightDragbar!=null){
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
		//var height = Master.getPositionPx(this.master.container).height;
		//var width = Master.getPositionPx(this.master.container).width;

		var height = this.master.getPosition(this.master.container).height;
		var width = this.master.getPosition(this.master.container).width;		
		
		if(this.topDragbar!=null){
			//top = Master.getPositionPx(this.topDragbar.dragbar).top;
			top = this.master.getPosition(this.topDragbar.dragbar).top;
			height = height - top;
		}

		if(this.bottomDragbar!=null){
			//height = Master.getPositionPx(this.bottomDragbar.dragbar).top - top;
			height = this.master.getPosition(this.bottomDragbar.dragbar).top - top;
		}

		if(this.leftDragbar!=null){
			//left = Master.getPositionPx(this.leftDragbar.dragbar).left
			left = this.master.getPosition(this.leftDragbar.dragbar).left
			width = width - left;
		}

		if(this.rightDragbar!=null){
			width = this.master.getPosition(this.rightDragbar.dragbar).left - left;
			//width = Master.getPositionPx(this.rightDragbar.dragbar).left - left;
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

		if(Master.getPositionPx(this.window).height < 50 || Master.getPositionPx(this.window).width < 50)
			this.button.show(false);

		else
			this.button.show(this.ifShowButton);

		// for Safari
		this.window.style.position = "absolute";


	}

	// not used
	fitTheAreaBetweenDragbarsRescale(){
		var top = 0;
		var left = 0;
		//var height = Master.getPositionPx(this.master.container).height;
		//var width = Master.getPositionPx(this.master.container).width;

		var height = this.master.getPosition(this.master.container).height;
		var width = this.master.getPosition(this.master.container).width;		
		
		if(this.topDragbar!=null){
			
			if(this.topDragbar.bottomPx!=0){

				let containerPosition = this.master.container.getBoundingClientRect();
				top = (containerPosition.height - this.topDragbar.bottomPx)/containerPosition.height * 100;
			}

			else{
				top = this.master.getPosition(this.topDragbar.dragbar).top;	
			}
			this.window.style.top = top + "%";
			height = height - top;
		}

		if(this.bottomDragbar!=null){
			//height = Master.getPositionPx(this.bottomDragbar.dragbar).top - top;
			height = this.master.getPosition(this.bottomDragbar.dragbar).top - top;
		}

		if(this.leftDragbar!=null){
			//left = Master.getPositionPx(this.leftDragbar.dragbar).left
			left = this.master.getPosition(this.leftDragbar.dragbar).left
			width = width - left;
		}

		if(this.rightDragbar!=null){
			width = this.master.getPosition(this.rightDragbar.dragbar).left - left;
			//width = Master.getPositionPx(this.rightDragbar.dragbar).left - left;
		}
		/*
		this.window.style.left = left + "px";
		this.window.style.width = width + "px";
		this.window.style.top = top + "px";
		this.window.style.height = height + "px";
		*/

		this.window.style.left = left + "%";
		this.window.style.width = width + "%";
		
		this.window.style.height = height + "%";

		if(Master.getPositionPx(this.window).height < 50 || Master.getPositionPx(this.window).width < 50)
			this.button.show(false);

		else
			this.button.show(true);

		// for Safari
		this.window.style.position = "absolute";


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

	setWidth(value){
		this.window.style.width = (value - this.master.getPosition(this.window).left)+ "%";

	}

	setLeft(value){
		this.window.style.left = value + "%";

	}

	setHeight(value){
		this.window.style.height = (value - this.master.getPosition(this.window).top)+ "%";
	}

	setTop(value){
		this.window.style.top = value + "%";
	}

	hover(owner, flag){
		var self = this;
		if(flag){
			$(this.window).hover(function(){
				console.log("Mouse in " + self.id + " detected.")
				owner.makeMyWindowsUnhover();
				owner.splitThistWindow(self);
			}
				)
			
		}

		else{
			$(this.window).off( "mouseenter mouseleave" );
		}
	}

	updateMenu(){
		this.button.update();
	}

	createChildWindow(id){
		var div = document.createElement("div");
		div.id = id;
		
		//console.log("The new " + id + " was created!")
		return this.window.appendChild(div);
		
	}

	showButton(flag){
		this.button.show(flag);
		this.ifShowButton = flag;
	}

}