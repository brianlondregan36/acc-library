var acclib = (function AccModule() {

	function AssignRoles(){
		var pageArea = document.getElementsByClassName('pagearea'); 
		if( pageArea ) {
			pageArea[0].setAttribute("role", "main");
		}
		else {
			console.log("Could not find a container in the layout to assign the main role")
		}
		var fieldsets = document.getElementsByTagName('fieldset');
		for(var i = 0; i < fieldsets.length; i++){
			fieldsets[i].setAttribute("role", "form");
		}
	}
	

	
	function MakeFocusVisible() {
		var css = 'select:focus, input:focus, textarea:focus, a:focus, button:focus { outline: 2px solid #6699ff !important; }';
		var head = document.head || document.getElementsByTagName('head')[0];
		var style = document.createElement('style');
	
		style.type = 'text/css';
		if (style.styleSheet){
			style.styleSheet.cssText = css;
		} 
		else {
			style.appendChild(document.createTextNode(css));
		}

		head.appendChild(style);
	}
		
	function CheckAltTags() {
		var elems = document.getElementsByTagName('img'); 
		for(var i = 0; i < elems.length; i++) {
			var a = elems[i].getAttribute('alt');
			if( !a || a == "") {
				console.log(elems[i].outerHTML + " is missing an Alt tag"); 
			}
			else if( a.toString().length > 125 ) {
				console.log(elems[i].outerHTML + " needs a shorter Alt tag"); 
			}
		}
	}
	
	
	
	
	
	function BuildBetterTitle(newTitle) {
		document.title = newTitle;
	}
		
	return {
		AssignRoles: AssignRoles,
		MakeFocusVisible: MakeFocusVisible,
		CheckForMissingAltTags: CheckForMissingAltTags,
		BuildBetterTitle: BuildBetterTitle
	};			
		
})(); //END AccModule




	









