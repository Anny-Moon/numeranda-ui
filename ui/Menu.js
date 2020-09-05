import {Master} from './Master.js';
import {Window} from './Window.js';

export class Menu{
	constructor(owner){
		this.owner = owner;
		this.id = owner.id + "_button"
		this.button = Master.createDiv(owner.window, this.id , "menuButton");
		this.makeButtonClickable();

		//this.menu = Master.createDiv(owner.window, this.owner.id+"_menu", "menu");
		this.menu = document.getElementById("menu");
		//self.menu.style.top = "500px"
		this.fillMenu();
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

	fillMenu(){
		var self = this;

		var menu = document.createElement("div");
		menu.setAttribute("class", "menu");
		this.menu = this.owner.window.appendChild(menu);

		var list = document.createElement("ul");
		this.menuList = this.menu.appendChild(list);

		//this.menuList = this.owner.master.container.appendChild(list);

		var li = document.createElement("li");
  		//var inputValue = document.getElementById("myInput").value;
  		li.appendChild(document.createTextNode("option 1"));
  		this.menuList.appendChild(li);
  		var li2 = document.createElement("li");
  		li2.appendChild(document.createTextNode("option 2"));

  		this.menuList.appendChild(li2);
  		this.menu.style.display = "none"


  		this.menu.style.bottom = parseInt($(this.button).css('bottom'), 10) + "px";
  		this.menu.style.right = parseInt($(this.button).css('right'), 10) + "px";
  		
  		$(this.menu).hover(function(){
    	
  		}, function(){
    		$(this).stop().slideUp(100);
  		});
  	
  		//this.menuList.style.top = "50%"


	}

}