import {Master} from './Master.js';
import {Window} from './Window.js';


export class Menu{
	constructor(owner){
		this.owner = owner;
		this.master = owner.master;
		this.id = owner.id + "_button"
		this.button = Master.createDiv(owner.window, this.id , "menuButton");
		this.makeButtonClickable();

		//this.menu = Master.createDiv(owner.window, this.owner.id+"_menu", "menu");
		this.menu = document.getElementById("menu");
		//self.menu.style.top = "500px"
		this.makeMenu();
		this.menuOptions = new Set();
	}


	makeButtonClickable(){
		var self = this;

		$(this.button)
			.button({
  				icon: "ui-icon-caret-1-s"
			});
			

        $(this.button).click(function(){ 
            console.log("clicked " + self.id);
            //self.menu.style.visibility = "visible"

            //$(".dropdown-menu").slideDown(100);

            $(self.menu).slideDown(100);
        	});

        	
	}

	makeMenu(){
		var self = this;

		var menu = document.createElement("div");
		menu.setAttribute("class", "menu");
		this.menu = this.owner.window.appendChild(menu);

		var list = document.createElement("ul");
		this.menuList = this.menu.appendChild(list);

		//this.menuList = this.owner.master.container.appendChild(list);

/*
		var li = document.createElement("li");
  		li.appendChild(document.createTextNode("option 1"));
  		this.menuList.appendChild(li);
  		
  		var li2 = document.createElement("li");
  		li2.appendChild(document.createTextNode("option 2"));
		this.menuList.appendChild(li2);
*/  		
  		this.menu.style.display = "none"


  		this.menu.style.bottom = parseInt($(this.button).css('bottom'), 10) + "px";
  		this.menu.style.right = parseInt($(this.button).css('right'), 10) + "px";
  		
  		$(this.menu).hover(function(){
    	
  		}, function(){
    		$(self.menu).stop().slideUp(100);
  		});


	}

	update(){
		var self = this;

		// delete all
	
		this.menuOptions.forEach(element => {
			self.menuList.removeChild(element);
			self.menuOptions.delete(element)

		})
		
		// add new
		this.master.menuOptions.forEach(element => {
			var tmp = document.createElement("li")
			tmp.appendChild(document.createTextNode(element.name));
			//$(tmp).click(function(){alert("clicked");})
			$(tmp).click(function(){
				element.callback(self.owner.childWindow.id);
				$(self.menu).stop().slideUp(20);
			})

			self.menuOptions.add(self.menuList.appendChild(tmp));

		})
	}

}

export class MenuOption{
	constructor(name, callback){
		this.name = name;
		this.callback = callback;
	}
}