var acclib = (function AccModule() {

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
	
	function CheckForMissingAltTags() {
		var elems = document.getElementsByTagName('img'); 
		for(var i = 0; i < elems.length; i++) {
			var a = elems[i].getAttribute('alt');
			if( !a || a == "") {
				console.log(elems[i].outerHTML + " is missing an Alt tag"); 
			}
		}
	}
	
	function BuildBetterTitle(newTitle) {
		document.title = newTitle;
	}
		
	return {
		MakeFocusVisible: x,
		CheckForMissingAltTags: y,
		BuildBetterTitle: z
	};			
		
})(); //END AccModule




	









