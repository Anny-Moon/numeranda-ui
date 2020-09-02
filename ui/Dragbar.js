export class Dragbar{
	constructor(id, extraClasses){
		if(id=="" || id == null){
			id = "dragbar" + numeranda.ui.getDragbarCounter();
		}
		this.id = id;
		this.dragbar = numeranda.ui.createDiv(id, extraClasses);
		numeranda.ui.dragbarCounterPlusPlus();
		numeranda.ui.pushDragbar(this);
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

