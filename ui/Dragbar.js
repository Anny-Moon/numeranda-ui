import {Master} from './Master.js';

export class Dragbar{
	constructor(master, id, extraClasses){
		this.master = master;
		if(id=="" || id == null){
			id = "dragbar" + this.master.getDragbarCounter();
		}
		this.id = id;
		this.dragbar = this.master.createDiv(id, extraClasses);
		this.master.dragbarCounterPlusPlus();
		this.master.pushDragbar(this);
		this.isLocked = false;
	}

	lock(){
		$(this.dragbar).draggable( "disable" );
		this.isLocked = true;
	};

	unlock(){
		$(this.dragbar).draggable( "enable" );
		this.isLocked = false;
	}

	

}

